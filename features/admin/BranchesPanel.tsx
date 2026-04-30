"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ManagedTenant } from "./types";
import { PanelSpinner, selectTriggerClass } from "./adminUi";

function formatBranchStatus(status: string): string {
  if (status === "active") return "Active";
  if (status === "inactive") return "Inactive";
  return status;
}

type BranchesPanelProps = {
  canCreateNewTenant: boolean;
  tenants: ManagedTenant[];
  loadingTenants: boolean;
  tenantDomain: string;
  setTenantDomain: (v: string) => void;
  tenantName: string;
  setTenantName: (v: string) => void;
  creatingTenant: boolean;
  onCreateTenant: (event: FormEvent<HTMLFormElement>) => void;
  editingTenantId: string | null;
  editingTenantName: string;
  setEditingTenantName: (v: string) => void;
  editingTenantStatus: string;
  setEditingTenantStatus: (v: string) => void;
  savingTenant: boolean;
  onStartTenantEdit: (tenant: ManagedTenant) => void;
  onSaveTenantEdit: () => void;
  onCancelTenantEdit: () => void;
};

export default function BranchesPanel({
  canCreateNewTenant,
  tenants,
  loadingTenants,
  tenantDomain,
  setTenantDomain,
  tenantName,
  setTenantName,
  creatingTenant,
  onCreateTenant,
  editingTenantId,
  editingTenantName,
  setEditingTenantName,
  editingTenantStatus,
  setEditingTenantStatus,
  savingTenant,
  onStartTenantEdit,
  onSaveTenantEdit,
  onCancelTenantEdit,
}: BranchesPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Branches</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add locations or divisions as branches. Each branch has its own domain, staff, and student data.
        </p>
      </div>

      {canCreateNewTenant ? (
        <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onCreateTenant}>
          <div className="md:col-span-2">
            <p className="mb-2 text-xs text-slate-600">
              <span className="font-medium text-slate-800">Branch domain</span> is the technical ID used in logins (no spaces).
              <span className="font-medium text-slate-800"> Branch name</span> is the friendly label shown in lists.
            </p>
          </div>
          <Input
            className="bg-white"
            placeholder="Branch domain (e.g. west-campus.local)"
            value={tenantDomain}
            onChange={(event) => setTenantDomain(event.target.value.replace(/\s+/g, "").toLowerCase())}
            required
          />
          <Input
            className="bg-white"
            placeholder="Display name (e.g. West Campus)"
            value={tenantName}
            onChange={(event) => setTenantName(event.target.value)}
          />
          <Button type="submit" className="w-fit" disabled={creatingTenant}>
            {creatingTenant ? "Creating branch…" : "Create branch"}
          </Button>
        </form>
      ) : null}

      {loadingTenants ? (
        <PanelSpinner label="Loading branches…" />
      ) : tenants.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white/50 py-8 text-center text-sm text-slate-600">
          No branches yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    {editingTenantId === tenant.id ? (
                      <Input
                        className="h-8 bg-white"
                        value={editingTenantName}
                        onChange={(event) => setEditingTenantName(event.target.value)}
                      />
                    ) : (
                      tenant.name
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{tenant.domain}</TableCell>
                  <TableCell>
                    {editingTenantId === tenant.id ? (
                      <select
                        className={`${selectTriggerClass} h-8 py-0`}
                        value={editingTenantStatus}
                        onChange={(event) => setEditingTenantStatus(event.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      formatBranchStatus(tenant.status)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTenantId === tenant.id ? (
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" disabled={savingTenant} onClick={() => void onSaveTenantEdit()}>
                          Save
                        </Button>
                        <Button type="button" size="sm" variant="secondary" onClick={onCancelTenantEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button type="button" size="sm" variant="secondary" onClick={() => onStartTenantEdit(tenant)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
