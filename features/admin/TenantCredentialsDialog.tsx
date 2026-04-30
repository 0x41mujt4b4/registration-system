"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export type TenantCredentials = {
  tenantName: string;
  domain: string;
  adminEmail: string;
  adminPassword: string;
};

type TenantCredentialsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: TenantCredentials | null;
};

export default function TenantCredentialsDialog({
  open,
  onOpenChange,
  credentials,
}: TenantCredentialsDialogProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    }
  };

  const summary = credentials
    ? `Branch name: ${credentials.tenantName}\nBranch domain: ${credentials.domain}\nAdmin email: ${credentials.adminEmail}\nAdmin password: ${credentials.adminPassword}`
    : "";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-6 shadow-lg focus:outline-none">
          {credentials ? (
            <>
          <Dialog.Title className="text-lg font-semibold text-slate-900">Branch created</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-slate-600">
            Share these login details only with the branch administrator. For security, we won&apos;t show this password
            again—save it now or reset it later from that branch.
          </Dialog.Description>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <dt className="font-medium text-slate-700">Branch name</dt>
              <dd className="rounded-md bg-slate-50 px-3 py-2 text-slate-900">{credentials.tenantName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-medium text-slate-700">Branch domain</dt>
              <dd className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-50 px-3 py-2 font-mono text-slate-900">{credentials.domain}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => void copy("domain", credentials.domain)}>
                  {copied === "domain" ? "Copied" : "Copy"}
                </Button>
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-medium text-slate-700">Administrator email</dt>
              <dd className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-50 px-3 py-2 font-mono text-slate-900">{credentials.adminEmail}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => void copy("email", credentials.adminEmail)}>
                  {copied === "email" ? "Copied" : "Copy"}
                </Button>
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-medium text-slate-700">Temporary password</dt>
              <dd className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-50 px-3 py-2 font-mono text-slate-900">{credentials.adminPassword}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => void copy("password", credentials.adminPassword)}>
                  {copied === "password" ? "Copied" : "Copy"}
                </Button>
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => void copy("all", summary)}>
              {copied === "all" ? "Copied all" : "Copy all"}
            </Button>
            <Dialog.Close asChild>
              <Button type="button">Done</Button>
            </Dialog.Close>
          </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
