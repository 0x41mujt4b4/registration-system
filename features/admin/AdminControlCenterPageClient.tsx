"use client";

import { useEffect, useState, type FormEvent } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BranchesPanel from "./BranchesPanel";
import DeleteUserConfirmDialog from "./DeleteUserConfirmDialog";
import RegistrationOptionsPanel from "./RegistrationOptionsPanel";
import TenantCredentialsDialog, { type TenantCredentials } from "./TenantCredentialsDialog";
import UsersPanel from "./UsersPanel";
import type { EditableRegistrationOptions, ManagedTenant, ManagedUser, OptionGroupKey } from "./types";

type AdminControlCenterPageClientProps = {
  permissions: string[];
  isMasterTenant: boolean;
  ownTenantDomain: string;
};

const DEFAULT_USER_PERMISSIONS = ["students:read", "students:create"] as const;

function permissionsForRole(role: string): string[] {
  if (role === "admin") {
    return [STUDENTS_READ, STUDENTS_CREATE, USERS_READ, USERS_CREATE, TENANTS_READ, TENANTS_CREATE];
  }
  return [...DEFAULT_USER_PERMISSIONS];
}

function normalizeNoSpaces(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase();
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
  const [tenantCredentials, setTenantCredentials] = useState<TenantCredentials | null>(null);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserName, setEditingUserName] = useState("");
  const [editingUserRole, setEditingUserRole] = useState("user");
  const [editingUserPermissions, setEditingUserPermissions] = useState<string[]>([]);
  const [editingUserPassword, setEditingUserPassword] = useState("");
  const [editingUserRepeatPassword, setEditingUserRepeatPassword] = useState("");
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; login: string } | null>(null);

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
    const timer = window.setTimeout(() => {
      void loadUsers();
      void loadTenants();
      void loadRegistrationOptions();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const saveRegistrationOptions = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savingRegistrationOptions) return;
    void persistRegistrationOptions(registrationOptions, "Registration options saved successfully.");
  };

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreateNewUser || creatingUser) return;
    if (newUserPassword !== newUserRepeatPassword) {
      setError("Password and repeat password must match.");
      return;
    }
    const username = normalizeNoSpaces(newUsername);
    const domain = normalizeNoSpaces(ownTenantDomain);
    if (!username || !domain) {
      setError("Enter a username. If branch domain is missing on your account, contact support.");
      return;
    }
    if (/\s/.test(username) || /\s/.test(domain)) {
      setError("Username and branch domain cannot contain spaces.");
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

  const createTenant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreateNewTenant || creatingTenant) return;
    if (/\s/.test(tenantDomain.trim())) {
      setError("Branch domain cannot contain spaces.");
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
          bootstrapAdminEmail
          bootstrapAdminPassword
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
    const createdTenant = result.data.addTenant;
    const adminEmail = createdTenant.bootstrapAdminEmail ?? `admin@${createdTenant.domain}`;
    const adminPassword = createdTenant.bootstrapAdminPassword ?? "Admin@12345";
    setTenantCredentials({
      tenantName: createdTenant.name,
      domain: createdTenant.domain,
      adminEmail,
      adminPassword,
    });
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
    setDeleteTarget(null);
  };

  const togglePermission = (target: "new" | "edit", permission: string) => {
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

  const onNewUserRoleChange = (role: string) => {
    setNewUserRole(role);
    setNewUserPermissions(permissionsForRole(role));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 text-slate-800">
      <div className="surface-elevated rounded-xl p-6 md:p-8">
        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
        ) : null}

        <div>
          <Tabs defaultValue="staff" className="w-full">
            <TabsList className="flex w-full flex-wrap justify-start gap-1 md:w-auto">
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="registration">Registration options</TabsTrigger>
              {isMasterTenant ? <TabsTrigger value="branches">Branches</TabsTrigger> : null}
            </TabsList>

            <TabsContent value="staff">
              <UsersPanel
                canReadUsersList={canReadUsersList}
                canCreateNewUser={canCreateNewUser}
                users={users}
                loadingUsers={loadingUsers}
                ownTenantDomain={ownTenantDomain}
                newUserName={newUserName}
                setNewUserName={setNewUserName}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                newUserPassword={newUserPassword}
                setNewUserPassword={setNewUserPassword}
                newUserRepeatPassword={newUserRepeatPassword}
                setNewUserRepeatPassword={setNewUserRepeatPassword}
                newUserRole={newUserRole}
                onNewUserRoleChange={onNewUserRoleChange}
                newUserPermissions={newUserPermissions}
                togglePermission={togglePermission}
                creatingUser={creatingUser}
                onCreateUser={createUser}
                editingUserId={editingUserId}
                editingUserName={editingUserName}
                setEditingUserName={setEditingUserName}
                editingUserRole={editingUserRole}
                setEditingUserRole={setEditingUserRole}
                editingUserPermissions={editingUserPermissions}
                editingUserPassword={editingUserPassword}
                setEditingUserPassword={setEditingUserPassword}
                editingUserRepeatPassword={editingUserRepeatPassword}
                setEditingUserRepeatPassword={setEditingUserRepeatPassword}
                savingUser={savingUser}
                deletingUserId={deletingUserId}
                onStartUserEdit={startUserEdit}
                onSaveUserEdit={() => void saveUserEdit()}
                onCancelUserEdit={() => setEditingUserId(null)}
                onRequestDeleteUser={(user) => setDeleteTarget({ id: user.id, login: user.username })}
              />
            </TabsContent>

            <TabsContent value="registration">
              <RegistrationOptionsPanel
                loadingRegistrationOptions={loadingRegistrationOptions}
                savingRegistrationOptions={savingRegistrationOptions}
                registrationOptionsError={registrationOptionsError}
                registrationOptionsSuccess={registrationOptionsSuccess}
                registrationOptions={registrationOptions}
                setRegistrationOptions={setRegistrationOptions}
                newOptionValues={newOptionValues}
                setNewOptionValues={setNewOptionValues}
                selectedOptionIndexes={selectedOptionIndexes}
                setSelectedOptionIndexes={setSelectedOptionIndexes}
                editingOptionIndexes={editingOptionIndexes}
                setEditingOptionIndexes={setEditingOptionIndexes}
                editingOptionValues={editingOptionValues}
                setEditingOptionValues={setEditingOptionValues}
                onSaveRegistrationOptions={saveRegistrationOptions}
                onStartEditingOption={startEditingOption}
                onSaveEditedOption={(group) => void saveEditedOption(group)}
                onDeleteSelectedOption={(group) => void deleteSelectedOption(group)}
                onAddOptionToGroup={(group) => void addOptionToGroup(group)}
              />
            </TabsContent>

            {isMasterTenant ? (
              <TabsContent value="branches">
                <BranchesPanel
                  canCreateNewTenant={canCreateNewTenant}
                  tenants={tenants}
                  loadingTenants={loadingTenants}
                  tenantDomain={tenantDomain}
                  setTenantDomain={setTenantDomain}
                  tenantName={tenantName}
                  setTenantName={setTenantName}
                  creatingTenant={creatingTenant}
                  onCreateTenant={createTenant}
                  editingTenantId={editingTenantId}
                  editingTenantName={editingTenantName}
                  setEditingTenantName={setEditingTenantName}
                  editingTenantStatus={editingTenantStatus}
                  setEditingTenantStatus={setEditingTenantStatus}
                  savingTenant={savingTenant}
                  onStartTenantEdit={startTenantEdit}
                  onSaveTenantEdit={() => void saveTenantEdit()}
                  onCancelTenantEdit={() => setEditingTenantId(null)}
                />
              </TabsContent>
            ) : null}
          </Tabs>
        </div>
      </div>

      <TenantCredentialsDialog
        open={tenantCredentials !== null}
        onOpenChange={(open) => {
          if (!open) setTenantCredentials(null);
        }}
        credentials={tenantCredentials}
      />

      <DeleteUserConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        userLogin={deleteTarget?.login ?? ""}
        deleting={deleteTarget !== null && deletingUserId === deleteTarget.id}
        onConfirm={() => {
          if (deleteTarget) void deleteUser(deleteTarget.id);
        }}
      />
    </main>
  );
}
