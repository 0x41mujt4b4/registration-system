"use client";

import { useEffect, useState } from "react";
import { fetchGraphQL, toUserFriendlyErrorMessage } from "@/lib/graphql-client";
import { IRegistrationOptions } from "@/types";
import {
  canCreateTenants,
  canCreateUsers,
  canReadTenants,
  canReadUsers,
  STUDENTS_CREATE,
  STUDENTS_READ,
  TENANTS_CREATE,
  TENANTS_READ,
  USERS_CREATE,
  USERS_READ,
} from "@/lib/permissions";

type AdminControlCenterPageClientProps = {
  permissions: string[];
  isMasterTenant: boolean;
  ownTenantDomain: string;
};

type ManagedUser = {
  id: string;
  name: string;
  username: string;
  role: string;
  permissions: string[];
  tenantId: string;
};

type ManagedTenant = {
  id: string;
  domain: string;
  name: string;
  dbName: string;
  status: string;
};

type EditableRegistrationOptions = {
  sessionOptions: string[];
  courseOptions: string[];
  levelOptions: string[];
  timeOptions: string[];
  feesTypeOptions: string[];
  defaultFeesAmount: string;
};

type OptionGroupKey = Exclude<keyof EditableRegistrationOptions, "defaultFeesAmount">;

const DEFAULT_USER_PERMISSIONS = ["students:read", "students:create"] as const;
const ALL_MANAGEABLE_PERMISSIONS = [
  STUDENTS_READ,
  STUDENTS_CREATE,
  USERS_READ,
  USERS_CREATE,
  TENANTS_READ,
  TENANTS_CREATE,
] as const;
const OPTION_GROUPS: { key: OptionGroupKey; label: string }[] = [
  { key: "sessionOptions", label: "Session options" },
  { key: "courseOptions", label: "Course options" },
  { key: "levelOptions", label: "Level options" },
  { key: "timeOptions", label: "Time options" },
  { key: "feesTypeOptions", label: "Fees type options" },
];

function splitEmail(email: string): { username: string; domain: string } {
  const [username = "", domain = ""] = email.split("@");
  return { username, domain };
}

function permissionsForRole(role: string): string[] {
  if (role === "admin") {
    return [STUDENTS_READ, STUDENTS_CREATE, USERS_READ, USERS_CREATE, TENANTS_READ, TENANTS_CREATE];
  }
  return [...DEFAULT_USER_PERMISSIONS];
}

export default function AdminControlCenterPageClient({
  permissions,
  isMasterTenant,
  ownTenantDomain,
}: AdminControlCenterPageClientProps) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [tenants, setTenants] = useState<ManagedTenant[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newUserName, setNewUserName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRepeatPassword, setNewUserRepeatPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>([...DEFAULT_USER_PERMISSIONS]);
  const [creatingUser, setCreatingUser] = useState(false);

  const [tenantDomain, setTenantDomain] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [creatingTenant, setCreatingTenant] = useState(false);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserName, setEditingUserName] = useState("");
  const [editingUserRole, setEditingUserRole] = useState("user");
  const [editingUserPermissions, setEditingUserPermissions] = useState<string[]>([]);
  const [editingUserPassword, setEditingUserPassword] = useState("");
  const [editingUserRepeatPassword, setEditingUserRepeatPassword] = useState("");
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);
  const [editingTenantName, setEditingTenantName] = useState("");
  const [editingTenantStatus, setEditingTenantStatus] = useState("active");
  const [savingTenant, setSavingTenant] = useState(false);
  const [loadingRegistrationOptions, setLoadingRegistrationOptions] = useState(true);
  const [savingRegistrationOptions, setSavingRegistrationOptions] = useState(false);
  const [registrationOptionsError, setRegistrationOptionsError] = useState<string | null>(null);
  const [registrationOptionsSuccess, setRegistrationOptionsSuccess] = useState<string | null>(null);
  const [registrationOptions, setRegistrationOptions] = useState<EditableRegistrationOptions>({
    sessionOptions: [],
    courseOptions: [],
    levelOptions: [],
    timeOptions: [],
    feesTypeOptions: [],
    defaultFeesAmount: "1600",
  });
  const [newOptionValues, setNewOptionValues] = useState<Record<OptionGroupKey, string>>({
    sessionOptions: "",
    courseOptions: "",
    levelOptions: "",
    timeOptions: "",
    feesTypeOptions: "",
  });
  const [selectedOptionIndexes, setSelectedOptionIndexes] = useState<Record<OptionGroupKey, number>>({
    sessionOptions: -1,
    courseOptions: -1,
    levelOptions: -1,
    timeOptions: -1,
    feesTypeOptions: -1,
  });
  const [editingOptionIndexes, setEditingOptionIndexes] = useState<Record<OptionGroupKey, number>>({
    sessionOptions: -1,
    courseOptions: -1,
    levelOptions: -1,
    timeOptions: -1,
    feesTypeOptions: -1,
  });
  const [editingOptionValues, setEditingOptionValues] = useState<Record<OptionGroupKey, string>>({
    sessionOptions: "",
    courseOptions: "",
    levelOptions: "",
    timeOptions: "",
    feesTypeOptions: "",
  });

  const canReadUsersList = canReadUsers(permissions);
  const canReadTenantsList = canReadTenants(permissions);
  const canCreateNewUser = canCreateUsers(permissions);
  const canCreateNewTenant = canCreateTenants(permissions);

  const normalizeNoSpaces = (value: string): string => value.replace(/\s+/g, "").toLowerCase();

  const loadUsers = async () => {
    if (!canReadUsersList) {
      setLoadingUsers(false);
      return;
    }
    setLoadingUsers(true);
    const result = await fetchGraphQL<{ getUsers: ManagedUser[] }>(`
      query GetUsers {
        getUsers {
          id
          name
          username
          role
          permissions
          tenantId
        }
      }
    `);
    if (!result.success) {
      setError(toUserFriendlyErrorMessage(new Error(result.error)));
      setLoadingUsers(false);
      return;
    }
    setUsers(result.data.getUsers);
    setLoadingUsers(false);
  };

  const loadTenants = async () => {
    if (!canReadTenantsList) {
      setLoadingTenants(false);
      return;
    }
    setLoadingTenants(true);
    const result = await fetchGraphQL<{ getTenants: ManagedTenant[] }>(`
      query GetTenants {
        getTenants {
          id
          domain
          name
          dbName
          status
        }
      }
    `);
    if (!result.success) {
      setError(toUserFriendlyErrorMessage(new Error(result.error)));
      setLoadingTenants(false);
      return;
    }
    setTenants(result.data.getTenants);
    setLoadingTenants(false);
  };

  const toEditableRegistrationOptions = (options: IRegistrationOptions): EditableRegistrationOptions => ({
    sessionOptions: options.sessionOptions,
    courseOptions: options.courseOptions,
    levelOptions: options.levelOptions,
    timeOptions: options.timeOptions,
    feesTypeOptions: options.feesTypeOptions,
    defaultFeesAmount: String(options.defaultFeesAmount ?? 0),
  });

  const loadRegistrationOptions = async () => {
    setLoadingRegistrationOptions(true);
    setRegistrationOptionsError(null);
    const result = await fetchGraphQL<{ getRegistrationOptions: IRegistrationOptions }>(`
      query GetRegistrationOptions {
        getRegistrationOptions {
          sessionOptions
          courseOptions
          levelOptions
          timeOptions
          feesTypeOptions
          defaultFeesAmount
        }
      }
    `);
    if (!result.success) {
      setRegistrationOptionsError(toUserFriendlyErrorMessage(new Error(result.error)));
      setLoadingRegistrationOptions(false);
      return;
    }
    setRegistrationOptions(toEditableRegistrationOptions(result.data.getRegistrationOptions));
    setSelectedOptionIndexes({
      sessionOptions: -1,
      courseOptions: -1,
      levelOptions: -1,
      timeOptions: -1,
      feesTypeOptions: -1,
    });
    setEditingOptionIndexes({
      sessionOptions: -1,
      courseOptions: -1,
      levelOptions: -1,
      timeOptions: -1,
      feesTypeOptions: -1,
    });
    setEditingOptionValues({
      sessionOptions: "",
      courseOptions: "",
      levelOptions: "",
      timeOptions: "",
      feesTypeOptions: "",
    });
    setLoadingRegistrationOptions(false);
  };

  useEffect(() => {
    void loadUsers();
    void loadTenants();
    void loadRegistrationOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOptionGroup = (group: OptionGroupKey, updater: (current: string[]) => string[]) => {
    setRegistrationOptions((prev) => ({ ...prev, [group]: updater(prev[group]) }));
  };

  const persistRegistrationOptions = async (
    nextOptions: EditableRegistrationOptions,
    successMessage: string,
  ): Promise<boolean> => {
    const defaultFeesAmount = Number.parseFloat(nextOptions.defaultFeesAmount);
    if (Number.isNaN(defaultFeesAmount) || defaultFeesAmount < 0) {
      setRegistrationOptionsError("Default fees amount must be a valid positive number.");
      return false;
    }
    setSavingRegistrationOptions(true);
    setRegistrationOptionsError(null);
    setRegistrationOptionsSuccess(null);
    const result = await fetchGraphQL<{ updateRegistrationOptions: IRegistrationOptions }>(
      `
      mutation UpdateRegistrationOptions(
        $sessionOptions: [String!]
        $courseOptions: [String!]
        $levelOptions: [String!]
        $timeOptions: [String!]
        $feesTypeOptions: [String!]
        $defaultFeesAmount: Float
      ) {
        updateRegistrationOptions(
          sessionOptions: $sessionOptions
          courseOptions: $courseOptions
          levelOptions: $levelOptions
          timeOptions: $timeOptions
          feesTypeOptions: $feesTypeOptions
          defaultFeesAmount: $defaultFeesAmount
        ) {
          sessionOptions
          courseOptions
          levelOptions
          timeOptions
          feesTypeOptions
          defaultFeesAmount
        }
      }
      `,
      {
        sessionOptions: nextOptions.sessionOptions,
        courseOptions: nextOptions.courseOptions,
        levelOptions: nextOptions.levelOptions,
        timeOptions: nextOptions.timeOptions,
        feesTypeOptions: nextOptions.feesTypeOptions,
        defaultFeesAmount,
      },
    );
    if (!result.success) {
      setRegistrationOptionsError(toUserFriendlyErrorMessage(new Error(result.error)));
      setSavingRegistrationOptions(false);
      return false;
    }
    setRegistrationOptions(toEditableRegistrationOptions(result.data.updateRegistrationOptions));
    setRegistrationOptionsSuccess(successMessage);
    setSavingRegistrationOptions(false);
    return true;
  };

  const addOptionToGroup = async (group: OptionGroupKey) => {
    const value = newOptionValues[group].trim();
    if (!value) {
      setRegistrationOptionsError("Option value cannot be empty.");
      return;
    }
    if (registrationOptions[group].includes(value)) {
      setRegistrationOptionsError(`"${value}" already exists in ${group}.`);
      return;
    }
    const nextOptions: EditableRegistrationOptions = {
      ...registrationOptions,
      [group]: [...registrationOptions[group], value],
    };
    const ok = await persistRegistrationOptions(nextOptions, "Option added successfully.");
    if (!ok) return;
    setNewOptionValues((prev) => ({ ...prev, [group]: "" }));
  };

  const deleteSelectedOption = async (group: OptionGroupKey) => {
    const idx = selectedOptionIndexes[group];
    if (idx < 0) return;
    const nextOptions: EditableRegistrationOptions = {
      ...registrationOptions,
      [group]: registrationOptions[group].filter((_, optionIndex) => optionIndex !== idx),
    };
    const ok = await persistRegistrationOptions(nextOptions, "Option deleted successfully.");
    if (!ok) return;
    setSelectedOptionIndexes((prev) => ({ ...prev, [group]: -1 }));
    setEditingOptionIndexes((prev) => ({ ...prev, [group]: -1 }));
    setEditingOptionValues((prev) => ({ ...prev, [group]: "" }));
  };

  const startEditingOption = (group: OptionGroupKey) => {
    const idx = selectedOptionIndexes[group];
    if (idx < 0) return;
    const selectedValue = registrationOptions[group][idx] ?? "";
    setEditingOptionIndexes((prev) => ({ ...prev, [group]: idx }));
    setEditingOptionValues((prev) => ({ ...prev, [group]: selectedValue }));
  };

  const saveEditedOption = async (group: OptionGroupKey) => {
    const idx = editingOptionIndexes[group];
    const nextValue = editingOptionValues[group].trim();
    if (idx < 0 || !nextValue) {
      setRegistrationOptionsError("Updated option cannot be empty.");
      return;
    }
    const duplicateIndex = registrationOptions[group].findIndex((item) => item === nextValue);
    if (duplicateIndex >= 0 && duplicateIndex !== idx) {
      setRegistrationOptionsError(`"${nextValue}" already exists in ${group}.`);
      return;
    }
    const nextOptions: EditableRegistrationOptions = {
      ...registrationOptions,
      [group]: registrationOptions[group].map((item, optionIndex) => (optionIndex === idx ? nextValue : item)),
    };
    const ok = await persistRegistrationOptions(nextOptions, "Option updated successfully.");
    if (!ok) return;
    setEditingOptionIndexes((prev) => ({ ...prev, [group]: -1 }));
    setEditingOptionValues((prev) => ({ ...prev, [group]: "" }));
  };

  const saveRegistrationOptions = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savingRegistrationOptions) return;
    void persistRegistrationOptions(registrationOptions, "Registration options saved successfully.");
  };

  const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreateNewUser || creatingUser) return;
    if (newUserPassword !== newUserRepeatPassword) {
      setError("Password and repeat password must match.");
      return;
    }
    const username = normalizeNoSpaces(newUsername);
    const domain = normalizeNoSpaces(ownTenantDomain);
    if (!username || !domain) {
      setError("Please select a tenant domain and enter a username.");
      return;
    }
    if (/\s/.test(username) || /\s/.test(domain)) {
      setError("Username and tenant domain must not contain spaces.");
      return;
    }
    setCreatingUser(true);
    setError(null);
    const result = await fetchGraphQL<{ addUser: string }>(
      `
      mutation AddUser(
        $name: String!
        $username: String!
        $tenantDomain: String!
        $password: String!
        $role: String
        $permissions: [String!]
      ) {
        addUser(
          name: $name
          username: $username
          tenantDomain: $tenantDomain
          password: $password
          role: $role
          permissions: $permissions
        )
      }
    `,
      {
        name: newUserName,
        username,
        tenantDomain: domain,
        password: newUserPassword,
        role: newUserRole,
        permissions: newUserPermissions,
      },
    );

    if (!result.success) {
      setError(toUserFriendlyErrorMessage(new Error(result.error)));
      setCreatingUser(false);
      return;
    }

    setNewUserName("");
    setNewUsername("");
    setNewUserPassword("");
    setNewUserRepeatPassword("");
    setNewUserRole("user");
    setNewUserPermissions([...DEFAULT_USER_PERMISSIONS]);
    await loadUsers();
    setCreatingUser(false);
  };

  const createTenant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreateNewTenant || creatingTenant) return;
    if (/\s/.test(tenantDomain.trim())) {
      setError("Tenant domain must not contain spaces.");
      return;
    }
    const normalizedTenantDomain = normalizeNoSpaces(tenantDomain);
    setCreatingTenant(true);
    setError(null);
    const result = await fetchGraphQL<{ addTenant: ManagedTenant }>(
      `
      mutation AddTenant($domain: String!, $name: String, $status: String) {
        addTenant(domain: $domain, name: $name, status: $status) {
          id
          domain
          name
          dbName
          status
        }
      }
    `,
      {
        domain: normalizedTenantDomain,
        name: tenantName || undefined,
        status: "active",
      },
    );

    if (!result.success) {
      setError(toUserFriendlyErrorMessage(new Error(result.error)));
      setCreatingTenant(false);
      return;
    }

    setTenantDomain("");
    setTenantName("");
    await loadTenants();
    setCreatingTenant(false);
  };

  const startUserEdit = (user: ManagedUser) => {
    setEditingUserId(user.id);
    setEditingUserName(user.name ?? "");
    setEditingUserRole(user.role ?? "user");
    setEditingUserPermissions(Array.isArray(user.permissions) ? user.permissions : []);
    setEditingUserPassword("");
    setEditingUserRepeatPassword("");
  };

  const saveUserEdit = async () => {
    if (!editingUserId || savingUser) return;
    if (editingUserPassword && editingUserPassword !== editingUserRepeatPassword) {
      setError("Password and repeat password must match.");
      return;
    }
    setSavingUser(true);
    setError(null);
    const result = await fetchGraphQL<{ updateUser: ManagedUser }>(
      `
      mutation UpdateUser($id: ID!, $name: String, $role: String, $password: String, $permissions: [String!]) {
        updateUser(id: $id, name: $name, role: $role, password: $password, permissions: $permissions) {
          id
        }
      }
      `,
      {
        id: editingUserId,
        name: editingUserName,
        role: editingUserRole,
        password: editingUserPassword || undefined,
        permissions: editingUserPermissions,
      },
    );
    if (!result.success) {
      setError(toUserFriendlyErrorMessage(new Error(result.error)));
      setSavingUser(false);
      return;
    }
    setEditingUserId(null);
    setEditingUserPassword("");
    setEditingUserRepeatPassword("");
    await loadUsers();
    setSavingUser(false);
  };

  const deleteUser = async (userId: string) => {
    if (deletingUserId) return;
    if (!window.confirm("Delete this user permanently?")) return;
    setDeletingUserId(userId);
    setError(null);
    const result = await fetchGraphQL<{ deleteUser: boolean }>(
      `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
      }
      `,
      { id: userId },
    );
    if (!result.success) {
      setError(toUserFriendlyErrorMessage(new Error(result.error)));
      setDeletingUserId(null);
      return;
    }
    await loadUsers();
    setDeletingUserId(null);
  };

  const togglePermission = (
    target: "new" | "edit",
    permission: string,
  ) => {
    const updater = (current: string[]) =>
      current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission];
    if (target === "new") {
      setNewUserPermissions(updater);
      return;
    }
    setEditingUserPermissions(updater);
  };

  const startTenantEdit = (tenant: ManagedTenant) => {
    setEditingTenantId(tenant.id);
    setEditingTenantName(tenant.name);
    setEditingTenantStatus(tenant.status || "active");
  };

  const saveTenantEdit = async () => {
    if (!editingTenantId || savingTenant) return;
    setSavingTenant(true);
    setError(null);
    const result = await fetchGraphQL<{ updateTenant: ManagedTenant }>(
      `
      mutation UpdateTenant($id: ID!, $name: String, $status: String) {
        updateTenant(id: $id, name: $name, status: $status) {
          id
        }
      }
      `,
      {
        id: editingTenantId,
        name: editingTenantName,
        status: editingTenantStatus,
      },
    );
    if (!result.success) {
      setError(toUserFriendlyErrorMessage(new Error(result.error)));
      setSavingTenant(false);
      return;
    }
    setEditingTenantId(null);
    await loadTenants();
    setSavingTenant(false);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800">Admin Control Center</h1>
      <p className="mt-2 text-sm text-slate-600">
        Manage users and branches. This page is available only for admin accounts.
      </p>
      {error ? <p className="mt-3 rounded bg-red-100 p-2 text-sm text-red-700">{error}</p> : null}

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-800">Users</h2>
        {canCreateNewUser ? (
          <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={createUser}>
            <input
              className="rounded border border-slate-300 px-3 py-2"
              placeholder="Full name"
              value={newUserName}
              onChange={(event) => setNewUserName(event.target.value)}
              required
            />
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                className="w-full rounded border border-slate-300 px-3 py-2"
                placeholder="Username"
                value={newUsername}
                onChange={(event) => setNewUsername(normalizeNoSpaces(event.target.value))}
                required
              />
              <span className="text-slate-500">@</span>
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 bg-slate-100 text-slate-600"
                value={ownTenantDomain}
                readOnly
              />
            </div>
            <input
              className="rounded border border-slate-300 px-3 py-2"
              placeholder="Password (min 6)"
              type="password"
              value={newUserPassword}
              onChange={(event) => setNewUserPassword(event.target.value)}
              minLength={6}
              required
            />
            <input
              className="rounded border border-slate-300 px-3 py-2"
              placeholder="Repeat password"
              type="password"
              value={newUserRepeatPassword}
              onChange={(event) => setNewUserRepeatPassword(event.target.value)}
              minLength={6}
              required
            />
            <select
              className="rounded border border-slate-300 px-3 py-2"
              value={newUserRole}
              onChange={(event) => {
                const role = event.target.value;
                setNewUserRole(role);
                setNewUserPermissions(permissionsForRole(role));
              }}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <div className="md:col-span-2 rounded border border-slate-200 p-3">
              <p className="mb-2 text-xs font-medium text-slate-600">Permissions</p>
              <div className="flex flex-wrap gap-3 text-sm">
                {ALL_MANAGEABLE_PERMISSIONS.map((permission) => (
                  <label key={permission} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newUserPermissions.includes(permission)}
                      onChange={() => togglePermission("new", permission)}
                    />
                    <span>{permission}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 md:col-span-2">
              Login will be saved as{" "}
              <code>{newUsername || "username"}@{ownTenantDomain || "tenant.domain"}</code>
            </p>
            <button
              type="submit"
              className="w-fit rounded bg-sky-600 px-4 py-2 font-medium text-white disabled:bg-sky-300"
              disabled={creatingUser}
            >
              {creatingUser ? "Creating..." : "Create User"}
            </button>
          </form>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          {loadingUsers ? (
            <p className="text-sm text-slate-500">Loading users...</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Login</th>
                  <th className="py-2 pr-4">Username</th>
                  <th className="py-2 pr-4">Tenant Domain</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Permissions</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isEditing = editingUserId === user.id;
                  const emailParts = splitEmail(user.username);
                  return (
                    <tr key={user.id} className="border-b border-slate-100">
                      <td className="py-2 pr-4">
                        {isEditing ? (
                          <input
                            className="rounded border border-slate-300 px-2 py-1"
                            value={editingUserName}
                            onChange={(event) => setEditingUserName(event.target.value)}
                          />
                        ) : (
                          user.name || "-"
                        )}
                      </td>
                      <td className="py-2 pr-4">{user.username}</td>
                      <td className="py-2 pr-4">{emailParts.username || "-"}</td>
                      <td className="py-2 pr-4">{emailParts.domain || "-"}</td>
                      <td className="py-2 pr-4">
                        {isEditing ? (
                          <select
                            className="rounded border border-slate-300 px-2 py-1"
                            value={editingUserRole}
                            onChange={(event) => setEditingUserRole(event.target.value)}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          user.role
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {isEditing ? (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {ALL_MANAGEABLE_PERMISSIONS.map((permission) => (
                              <label key={permission} className="flex items-center gap-1">
                                <input
                                  type="checkbox"
                                  checked={editingUserPermissions.includes(permission)}
                                  onChange={() => togglePermission("edit", permission)}
                                />
                                <span>{permission}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          user.permissions.join(", ") || "-"
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              className="rounded border border-slate-300 px-2 py-1"
                              placeholder="New password (optional)"
                              type="password"
                              value={editingUserPassword}
                              onChange={(event) => setEditingUserPassword(event.target.value)}
                            />
                            <input
                              className="rounded border border-slate-300 px-2 py-1"
                              placeholder="Repeat new password"
                              type="password"
                              value={editingUserRepeatPassword}
                              onChange={(event) => setEditingUserRepeatPassword(event.target.value)}
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="rounded bg-sky-600 px-3 py-1 text-white disabled:bg-sky-300"
                                disabled={savingUser}
                                onClick={() => void saveUserEdit()}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="rounded bg-slate-200 px-3 py-1 text-slate-700"
                                onClick={() => setEditingUserId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="rounded bg-slate-200 px-3 py-1 text-slate-700"
                              onClick={() => startUserEdit(user)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="rounded bg-red-600 px-3 py-1 text-white disabled:bg-red-300"
                              disabled={deletingUserId === user.id}
                              onClick={() => void deleteUser(user.id)}
                            >
                              {deletingUserId === user.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-800">Registration Options</h2>
        <p className="mt-1 text-xs text-slate-500">
          These options are used by the registration page for this tenant.
        </p>
        {registrationOptionsError ? (
          <p className="mt-3 rounded bg-red-100 p-2 text-sm text-red-700">{registrationOptionsError}</p>
        ) : null}
        {registrationOptionsSuccess ? (
          <p className="mt-3 rounded bg-green-100 p-2 text-sm text-green-700">{registrationOptionsSuccess}</p>
        ) : null}
        {loadingRegistrationOptions ? (
          <p className="mt-3 text-sm text-slate-500">Loading registration options...</p>
        ) : (
          <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={saveRegistrationOptions}>
            <div className="md:col-span-2 grid grid-cols-1 gap-4">
              {OPTION_GROUPS.map(({ key, label }) => {
                const selectedIndex = selectedOptionIndexes[key];
                const editIndex = editingOptionIndexes[key];
                return (
                  <div key={key} className="rounded border border-slate-200 p-3">
                    <p className="mb-2 text-xs font-medium text-slate-600">{label}</p>
                    <select
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={selectedIndex >= 0 ? String(selectedIndex) : ""}
                      onChange={(event) => {
                        const nextIndex = event.target.value === "" ? -1 : Number.parseInt(event.target.value, 10);
                        setSelectedOptionIndexes((prev) => ({ ...prev, [key]: Number.isNaN(nextIndex) ? -1 : nextIndex }));
                      }}
                    >
                      <option value="">Select option...</option>
                      {registrationOptions[key].map((option, optionIndex) => (
                        <option key={`${key}-${option}-${optionIndex}`} value={optionIndex}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded bg-slate-200 px-3 py-1 text-slate-700 disabled:opacity-50"
                        onClick={() => void startEditingOption(key)}
                        disabled={selectedIndex < 0 || savingRegistrationOptions}
                      >
                        Update Selected
                      </button>
                      <button
                        type="button"
                        className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                        onClick={() => void deleteSelectedOption(key)}
                        disabled={selectedIndex < 0 || savingRegistrationOptions}
                      >
                        Delete Selected
                      </button>
                    </div>
                    {editIndex >= 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <input
                          className="min-w-64 flex-1 rounded border border-slate-300 px-3 py-2"
                          value={editingOptionValues[key]}
                          onChange={(event) => setEditingOptionValues((prev) => ({ ...prev, [key]: event.target.value }))}
                        />
                        <button
                          type="button"
                          className="rounded bg-sky-600 px-3 py-2 text-white"
                          onClick={() => void saveEditedOption(key)}
                          disabled={savingRegistrationOptions}
                        >
                          Save Update
                        </button>
                        <button
                          type="button"
                          className="rounded bg-slate-200 px-3 py-2 text-slate-700"
                          onClick={() => {
                            setEditingOptionIndexes((prev) => ({ ...prev, [key]: -1 }));
                            setEditingOptionValues((prev) => ({ ...prev, [key]: "" }));
                          }}
                          disabled={savingRegistrationOptions}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <input
                        className="min-w-64 flex-1 rounded border border-slate-300 px-3 py-2"
                        placeholder={`Add new ${label.toLowerCase().replace(" options", "")}`}
                        value={newOptionValues[key]}
                        onChange={(event) => setNewOptionValues((prev) => ({ ...prev, [key]: event.target.value }))}
                      />
                      <button
                        type="button"
                        className="rounded bg-emerald-600 px-3 py-2 text-white"
                        onClick={() => void addOptionToGroup(key)}
                        disabled={savingRegistrationOptions}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <input
              className="rounded border border-slate-300 px-3 py-2"
              placeholder="Default fees amount"
              type="number"
              min={0}
              step="0.01"
              value={registrationOptions.defaultFeesAmount}
              onChange={(event) => setRegistrationOptions((prev) => ({ ...prev, defaultFeesAmount: event.target.value }))}
              required
            />
            <button
              type="submit"
              className="w-fit rounded bg-sky-600 px-4 py-2 font-medium text-white disabled:bg-sky-300"
              disabled={savingRegistrationOptions}
            >
              {savingRegistrationOptions ? "Saving..." : "Save Registration Options"}
            </button>
          </form>
        )}
      </section>

      {isMasterTenant ? (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-800">Branches</h2>
          {canCreateNewTenant ? (
            <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={createTenant}>
              <input
                className="rounded border border-slate-300 px-3 py-2"
                placeholder="Branch domain (e.g. acme.local)"
                value={tenantDomain}
                onChange={(event) => setTenantDomain(normalizeNoSpaces(event.target.value))}
                required
              />
              <input
                className="rounded border border-slate-300 px-3 py-2"
                placeholder="Branch name"
                value={tenantName}
                onChange={(event) => setTenantName(event.target.value)}
              />
              <button
                type="submit"
                className="w-fit rounded bg-sky-600 px-4 py-2 font-medium text-white disabled:bg-sky-300"
                disabled={creatingTenant}
              >
                {creatingTenant ? "Creating..." : "Create Tenant"}
              </button>
            </form>
          ) : null}

          <div className="mt-4 overflow-x-auto">
            {loadingTenants ? (
              <p className="text-sm text-slate-500">Loading tenants...</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Branch Domain</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-slate-100">
                      <td className="py-2 pr-4">
                        {editingTenantId === tenant.id ? (
                          <input
                            className="rounded border border-slate-300 px-2 py-1"
                            value={editingTenantName}
                            onChange={(event) => setEditingTenantName(event.target.value)}
                          />
                        ) : (
                          tenant.name
                        )}
                      </td>
                      <td className="py-2 pr-4">{tenant.domain}</td>
                      <td className="py-2 pr-4">
                        {editingTenantId === tenant.id ? (
                          <select
                            className="rounded border border-slate-300 px-2 py-1"
                            value={editingTenantStatus}
                            onChange={(event) => setEditingTenantStatus(event.target.value)}
                          >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                          </select>
                        ) : (
                          tenant.status
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {editingTenantId === tenant.id ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="rounded bg-sky-600 px-3 py-1 text-white disabled:bg-sky-300"
                              disabled={savingTenant}
                              onClick={() => void saveTenantEdit()}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="rounded bg-slate-200 px-3 py-1 text-slate-700"
                              onClick={() => setEditingTenantId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="rounded bg-slate-200 px-3 py-1 text-slate-700"
                            onClick={() => startTenantEdit(tenant)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
