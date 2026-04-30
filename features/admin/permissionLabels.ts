import {
  STUDENTS_CREATE,
  STUDENTS_READ,
  TENANTS_CREATE,
  TENANTS_READ,
  USERS_CREATE,
  USERS_READ,
} from "@/lib/permissions";

export type PermissionUiItem = {
  id: string;
  group: string;
  label: string;
  description: string;
};

/** Ordered list for admin staff permission pickers (IDs must match GraphQL / backend). */
export const MANAGEABLE_PERMISSION_UI: PermissionUiItem[] = [
  {
    id: STUDENTS_READ,
    group: "Students",
    label: "View students",
    description: "Open the dashboard and browse registered students.",
  },
  {
    id: STUDENTS_CREATE,
    group: "Students",
    label: "Register students",
    description: "Use the registration page to enroll new students.",
  },
  {
    id: USERS_READ,
    group: "Staff",
    label: "View staff",
    description: "See who has accounts at this branch.",
  },
  {
    id: USERS_CREATE,
    group: "Staff",
    label: "Manage staff",
    description: "Add, edit, or remove staff accounts (not full branch setup).",
  },
  {
    id: TENANTS_READ,
    group: "Branches",
    label: "View branches",
    description: "See other branches (head office only).",
  },
  {
    id: TENANTS_CREATE,
    group: "Branches",
    label: "Create branches",
    description: "Create new branches (head office only).",
  },
];

const LABEL_BY_ID = Object.fromEntries(MANAGEABLE_PERMISSION_UI.map((item) => [item.id, item.label])) as Record<
  string,
  string
>;

/** Compact display for tables (unknown IDs fall back to raw string). */
export function formatPermissionsForDisplay(permissions: string[]): string {
  if (!permissions.length) return "";
  return permissions.map((p) => LABEL_BY_ID[p] ?? p).join(", ");
}
