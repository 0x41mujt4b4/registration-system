import { DefaultSession } from "next-auth";

type AppUser = {
  id?: string;
  username?: string;
  role?: string;
  gatewayToken?: string;
  permissions?: string[];
  tenantId?: string;
  tenantDomain?: string;
  tenantDbName?: string;
  isMasterTenant?: boolean;
};

declare module "next-auth" {
  interface Session {
    user: AppUser & DefaultSession["user"];
  }

  interface User {
    id?: string;
    username?: string;
    role?: string;
    gatewayToken?: string;
    permissions?: string[];
    tenantId?: string;
    tenantDomain?: string;
    tenantDbName?: string;
    isMasterTenant?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    role?: string;
    gatewayToken?: string;
    permissions?: string[];
    tenantId?: string;
    tenantDomain?: string;
    tenantDbName?: string;
    isMasterTenant?: boolean;
  }
}
