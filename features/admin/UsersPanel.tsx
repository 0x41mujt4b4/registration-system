"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ManagedUser } from "./types";
import { formatPermissionsForDisplay, MANAGEABLE_PERMISSION_UI } from "./permissionLabels";
import { PanelSpinner, selectTriggerClass } from "./adminUi";

const PERMISSION_GROUP_ORDER = ["Students", "Staff", "Branches"] as const;

function splitEmail(email: string): { username: string; domain: string } {
  const [username = "", domain = ""] = email.split("@");
  return { username, domain };
}

function PermissionPicker({
  checked,
  onToggle,
  compact,
}: {
  checked: (id: string) => boolean;
  onToggle: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {PERMISSION_GROUP_ORDER.map((group) => {
        const items = MANAGEABLE_PERMISSION_UI.filter((item) => item.group === group);
        if (!items.length) return null;
        return (
          <div key={group}>
            <p className={`font-semibold text-slate-800 ${compact ? "text-[11px] uppercase tracking-wide" : "text-xs uppercase tracking-wide text-slate-600"}`}>
              {group}
            </p>
            <div className={`mt-2 grid gap-2 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
              {items.map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border border-zinc-200 bg-white transition-colors hover:border-zinc-300 hover:bg-slate-50/80 ${compact ? "p-2" : "p-3"}`}
                >
                  <Checkbox
                    className="mt-0.5 shrink-0"
                    checked={checked(item.id)}
                    onCheckedChange={() => onToggle(item.id)}
                  />
                  <span className="min-w-0">
                    <span className={`font-medium text-slate-900 ${compact ? "text-xs" : "text-sm"}`}>{item.label}</span>
                    <span className={`mt-0.5 block text-slate-600 ${compact ? "text-[11px] leading-snug" : "text-xs"}`}>
                      {item.description}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] text-slate-400">{item.id}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type UsersPanelProps = {
  canReadUsersList: boolean;
  canCreateNewUser: boolean;
  users: ManagedUser[];
  loadingUsers: boolean;
  ownTenantDomain: string;
  newUserName: string;
  setNewUserName: (v: string) => void;
  newUsername: string;
  setNewUsername: (v: string) => void;
  newUserPassword: string;
  setNewUserPassword: (v: string) => void;
  newUserRepeatPassword: string;
  setNewUserRepeatPassword: (v: string) => void;
  newUserRole: string;
  newUserPermissions: string[];
  onNewUserRoleChange: (role: string) => void;
  togglePermission: (target: "new" | "edit", permission: string) => void;
  creatingUser: boolean;
  onCreateUser: (event: FormEvent<HTMLFormElement>) => void;
  editingUserId: string | null;
  editingUserName: string;
  setEditingUserName: (v: string) => void;
  editingUserRole: string;
  setEditingUserRole: (v: string) => void;
  editingUserPermissions: string[];
  editingUserPassword: string;
  setEditingUserPassword: (v: string) => void;
  editingUserRepeatPassword: string;
  setEditingUserRepeatPassword: (v: string) => void;
  savingUser: boolean;
  deletingUserId: string | null;
  onStartUserEdit: (user: ManagedUser) => void;
  onSaveUserEdit: () => void;
  onCancelUserEdit: () => void;
  onRequestDeleteUser: (user: ManagedUser) => void;
};

export default function UsersPanel({
  canReadUsersList,
  canCreateNewUser,
  users,
  loadingUsers,
  ownTenantDomain,
  newUserName,
  setNewUserName,
  newUsername,
  setNewUsername,
  newUserPassword,
  setNewUserPassword,
  newUserRepeatPassword,
  setNewUserRepeatPassword,
  newUserRole,
  onNewUserRoleChange,
  newUserPermissions,
  togglePermission,
  creatingUser,
  onCreateUser,
  editingUserId,
  editingUserName,
  setEditingUserName,
  editingUserRole,
  setEditingUserRole,
  editingUserPermissions,
  editingUserPassword,
  setEditingUserPassword,
  editingUserRepeatPassword,
  setEditingUserRepeatPassword,
  savingUser,
  deletingUserId,
  onStartUserEdit,
  onSaveUserEdit,
  onCancelUserEdit,
  onRequestDeleteUser,
}: UsersPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Staff</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add staff accounts and set what they can do. Staff sign in with their username and your branch domain.
        </p>
      </div>

      {canCreateNewUser ? (
        <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onCreateUser}>
          <Input
            className="bg-white md:col-span-1"
            placeholder="Full name"
            value={newUserName}
            onChange={(event) => setNewUserName(event.target.value)}
            required
          />
          <div className="flex flex-col gap-2 md:col-span-2 md:flex-row md:items-center">
            <Input
              className="flex-1 bg-white"
              placeholder="Username"
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value.replace(/\s+/g, "").toLowerCase())}
              required
            />
            <span className="hidden text-slate-500 md:inline">@</span>
            <Input className="flex-1 bg-slate-100 text-slate-700" value={ownTenantDomain} readOnly title="Your branch domain (from your login)" />
          </div>
          <Input
            className="bg-white"
            placeholder="Password (min 6)"
            type="password"
            value={newUserPassword}
            onChange={(event) => setNewUserPassword(event.target.value)}
            minLength={6}
            required
          />
          <Input
            className="bg-white"
            placeholder="Repeat password"
            type="password"
            value={newUserRepeatPassword}
            onChange={(event) => setNewUserRepeatPassword(event.target.value)}
            minLength={6}
            required
          />
          <select
            className={selectTriggerClass}
            value={newUserRole}
            onChange={(event) => onNewUserRoleChange(event.target.value)}
            aria-label="Account type"
          >
            <option value="user">Standard</option>
            <option value="admin">Administrator</option>
          </select>
          <div className="md:col-span-2 rounded-lg border border-zinc-200 bg-white/90 p-4">
            <p className="text-sm font-semibold text-slate-900">Access rights</p>
            <p className="mt-1 text-xs text-slate-600">
              Choose what this staff member can do. The short code under each option is for support and logs.
            </p>
            <div className="mt-4">
              <PermissionPicker
                checked={(id) => newUserPermissions.includes(id)}
                onToggle={(id) => togglePermission("new", id)}
              />
            </div>
          </div>
          <p className="text-xs text-slate-600 md:col-span-2">
            Login will be saved as{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
              {newUsername || "username"}@{ownTenantDomain || "branch.domain"}
            </code>
          </p>
          <Button type="submit" className="w-fit" disabled={creatingUser}>
            {creatingUser ? "Adding…" : "Add staff member"}
          </Button>
        </form>
      ) : null}

      {!canReadUsersList ? (
        <p className="text-sm text-slate-600">You don&apos;t have permission to view the staff list.</p>
      ) : loadingUsers ? (
        <PanelSpinner label="Loading staff…" />
      ) : users.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white/50 py-8 text-center text-sm text-slate-600">
          No staff members yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Branch domain</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isEditing = editingUserId === user.id;
                const emailParts = splitEmail(user.username);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          className="h-8 bg-white"
                          value={editingUserName}
                          onChange={(event) => setEditingUserName(event.target.value)}
                        />
                      ) : (
                        user.name || "—"
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{user.username}</TableCell>
                    <TableCell>{emailParts.username || "—"}</TableCell>
                    <TableCell>{emailParts.domain || "—"}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <select
                          className={`${selectTriggerClass} h-8 py-0`}
                          value={editingUserRole}
                          onChange={(event) => setEditingUserRole(event.target.value)}
                          aria-label="Account type"
                        >
                          <option value="user">Standard</option>
                          <option value="admin">Administrator</option>
                        </select>
                      ) : (
                        user.role === "admin"
                          ? "Administrator"
                          : user.role === "user"
                            ? "Standard"
                            : user.role
                      )}
                    </TableCell>
                    <TableCell className="max-w-md align-top">
                      {isEditing ? (
                        <PermissionPicker
                          compact
                          checked={(id) => editingUserPermissions.includes(id)}
                          onToggle={(id) => togglePermission("edit", id)}
                        />
                      ) : (
                        <span className="text-sm text-slate-800">{formatPermissionsForDisplay(user.permissions) || "—"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <Input
                            className="h-8 bg-white"
                            placeholder="New password (optional)"
                            type="password"
                            value={editingUserPassword}
                            onChange={(event) => setEditingUserPassword(event.target.value)}
                          />
                          <Input
                            className="h-8 bg-white"
                            placeholder="Repeat new password"
                            type="password"
                            value={editingUserRepeatPassword}
                            onChange={(event) => setEditingUserRepeatPassword(event.target.value)}
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" size="sm" disabled={savingUser} onClick={() => void onSaveUserEdit()}>
                              Save
                            </Button>
                            <Button type="button" size="sm" variant="secondary" onClick={onCancelUserEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" size="sm" variant="secondary" onClick={() => onStartUserEdit(user)}>
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={deletingUserId === user.id}
                            onClick={() => onRequestDeleteUser(user)}
                          >
                            {deletingUserId === user.id ? "Removing…" : "Remove"}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
