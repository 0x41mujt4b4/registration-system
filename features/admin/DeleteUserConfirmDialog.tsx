"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

type DeleteUserConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLogin: string;
  deleting: boolean;
  onConfirm: () => void;
};

export default function DeleteUserConfirmDialog({
  open,
  onOpenChange,
  userLogin,
  deleting,
  onConfirm,
}: DeleteUserConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-6 shadow-lg focus:outline-none"
          onPointerDownOutside={(event) => deleting && event.preventDefault()}
          onEscapeKeyDown={(event) => deleting && event.preventDefault()}
        >
          <Dialog.Title className="text-lg font-semibold text-slate-900">Remove staff member?</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-slate-600">
            This permanently removes access for{" "}
            <span className="font-mono font-medium text-slate-800">{userLogin}</span>. This cannot be undone.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button type="button" variant="outline" disabled={deleting}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="button" variant="destructive" disabled={deleting} onClick={onConfirm}>
              {deleting ? "Removing…" : "Remove"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
