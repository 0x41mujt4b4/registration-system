export type ManagedUser = {
  id: string;
  name: string;
  username: string;
  role: string;
  permissions: string[];
  tenantId: string;
};

export type ManagedTenant = {
  id: string;
  domain: string;
  name: string;
  dbName: string;
  status: string;
  bootstrapAdminEmail?: string;
  bootstrapAdminPassword?: string;
};

export type EditableRegistrationOptions = {
  sessionOptions: string[];
  courseOptions: string[];
  levelOptions: string[];
  timeOptions: string[];
  feesTypeOptions: string[];
  defaultFeesAmount: string;
};

export type OptionGroupKey = Exclude<keyof EditableRegistrationOptions, "defaultFeesAmount">;
