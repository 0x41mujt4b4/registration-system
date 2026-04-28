import { VISION_GATEWAY_PROXY_SECRET_HEADER } from "@/server/visionGatewayProxyHeader";

const VISION_GATEWAY_TENANT_DOMAIN = process.env.VISION_GATEWAY_TENANT_DOMAIN ?? "vision.local";

const VISION_GATEWAY_DIRECT_BASE = process.env.VISION_GATEWAY_BASE_URL ?? "http://localhost:3000";

function visionGatewayRequestBase(): string {
  if (process.env.VISION_GATEWAY_USE_APP_PROXY === "true") {
    const vercel = process.env.VERCEL_URL;
    if (vercel) {
      return `https://${vercel}/api/vision-gateway`;
    }
    const nextAuth = process.env.NEXTAUTH_URL;
    if (nextAuth) {
      return `${nextAuth.replace(/\/$/, "")}/api/vision-gateway`;
    }
    throw new Error(
      "VISION_GATEWAY_USE_APP_PROXY is true but set VERCEL_URL (Vercel) or NEXTAUTH_URL (e.g. https://your-app.vercel.app) so the app can call its own HTTPS proxy.",
    );
  }
  return VISION_GATEWAY_DIRECT_BASE.replace(/\/$/, "");
}

function gatewayFetch(pathWithLeadingSlash: string, init?: RequestInit): Promise<Response> {
  const base = visionGatewayRequestBase();
  const url = `${base}${pathWithLeadingSlash}`;
  const headers = new Headers(init?.headers);
  const secret = process.env.VISION_GATEWAY_PROXY_SECRET;
  if (secret) {
    headers.set(VISION_GATEWAY_PROXY_SECRET_HEADER, secret);
  }
  return fetch(url, { ...init, headers });
}

type GatewayStudent = {
  id?: string;
  _id?: string;
  name: string;
  time?: string;
  feesAmount?: number;
  feesType?: string;
  course?: string;
  level?: string;
  session?: string;
  /** Per-tenant incremental id from the gateway. */
  studentNumber?: number;
  /** ISO string when the student paid (persisted on the gateway student document). */
  paymentDate?: string;
};

type GatewayUser = {
  id?: string;
  _id?: string;
  name?: string;
  email: string;
  role?: string;
  permissions?: string[];
  tenantId?: string;
};

type GatewayTenant = {
  id?: string;
  _id?: string;
  domain: string;
  name: string;
  dbName: string;
  status: string;
};

type GatewayLoginPayload = {
  access_token: string;
};

type DecodedGatewayToken = {
  role?: string;
  permissions?: string[];
  tenantId?: string;
  tenantDomain?: string;
  tenantDbName?: string;
  isMasterTenant?: boolean;
};

async function parseGatewayResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  let message = `Vision gateway request failed with status ${response.status}`;
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) {
      message = body.message.join(", ");
    } else if (typeof body.message === "string") {
      message = body.message;
    }
  } catch {
    // Ignore parse errors and keep generic message.
  }

  throw new Error(message);
}

function toGatewayEmail(username: string): string {
  const normalized = username.trim().toLowerCase();
  if (normalized.includes("@")) {
    return normalized;
  }
  return `${normalized}@${VISION_GATEWAY_TENANT_DOMAIN}`;
}

export async function createGatewayUser(
  input: { name: string; username: string; tenantDomain: string; password: string; role?: string; permissions?: string[] },
  accessToken: string,
): Promise<string> {
  const tenantEmail = `${input.username.trim().toLowerCase()}@${input.tenantDomain.trim().toLowerCase()}`;
  const response = await gatewayFetch("/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name.trim(),
      username: input.username.trim().toLowerCase(),
      tenantDomain: input.tenantDomain.trim().toLowerCase(),
      password: input.password,
      role: input.role ?? "user",
      permissions: Array.isArray(input.permissions) ? input.permissions : [],
    }),
  });

  const createdUser = await parseGatewayResponse<GatewayUser>(response);
  return createdUser.id ?? createdUser._id ?? tenantEmail;
}

export async function loginToGateway(username: string, password: string): Promise<string> {
  const response = await gatewayFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: toGatewayEmail(username),
      password,
    }),
  });

  const result = await parseGatewayResponse<GatewayLoginPayload>(response);
  return result.access_token;
}

function decodeJwtPayload(token: string): DecodedGatewayToken | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    const decoded = Buffer.from(parts[1] ?? "", "base64url").toString("utf8");
    return JSON.parse(decoded) as DecodedGatewayToken;
  } catch {
    return null;
  }
}

export async function loginToGatewayWithProfile(username: string, password: string): Promise<{
  accessToken: string;
  role: string;
  permissions: string[];
  tenantId: string;
  tenantDomain: string;
  tenantDbName: string;
  isMasterTenant: boolean;
}> {
  const accessToken = await loginToGateway(username, password);
  const decoded = decodeJwtPayload(accessToken);
  return {
    accessToken,
    role: decoded?.role ?? "user",
    permissions: Array.isArray(decoded?.permissions) ? decoded.permissions : [],
    tenantId: typeof decoded?.tenantId === "string" ? decoded.tenantId : "",
    tenantDomain: typeof decoded?.tenantDomain === "string" ? decoded.tenantDomain : "",
    tenantDbName: typeof decoded?.tenantDbName === "string" ? decoded.tenantDbName : "",
    isMasterTenant: decoded?.isMasterTenant === true,
  };
}

export async function getGatewayUser(username: string): Promise<{ id: string; username: string } | null> {
  const response = await gatewayFetch(`/users?email=${encodeURIComponent(toGatewayEmail(username))}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) {
    return null;
  }

  const user = await parseGatewayResponse<GatewayUser>(response);
  return {
    id: user.id ?? user._id ?? toGatewayEmail(username),
    username,
  };
}

export async function getGatewayUsers(accessToken: string): Promise<GatewayUser[]> {
  const response = await gatewayFetch("/users/list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return parseGatewayResponse<GatewayUser[]>(response);
}

export async function getGatewayTenants(accessToken: string): Promise<GatewayTenant[]> {
  const response = await gatewayFetch("/tenants", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return parseGatewayResponse<GatewayTenant[]>(response);
}

export async function createGatewayTenant(
  input: { domain: string; name?: string; status?: string },
  accessToken: string,
): Promise<GatewayTenant> {
  const response = await gatewayFetch("/tenants", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return parseGatewayResponse<GatewayTenant>(response);
}

export async function updateGatewayUser(
  id: string,
  input: { name?: string; role?: string; password?: string; permissions?: string[] },
  accessToken: string,
): Promise<GatewayUser> {
  const response = await gatewayFetch(`/users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return parseGatewayResponse<GatewayUser>(response);
}

export async function deleteGatewayUser(id: string, accessToken: string): Promise<boolean> {
  const response = await gatewayFetch(`/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    return true;
  }
  await parseGatewayResponse<unknown>(response);
  return false;
}

export async function updateGatewayTenant(
  id: string,
  input: { name?: string; status?: string },
  accessToken: string,
): Promise<GatewayTenant> {
  const response = await gatewayFetch(`/tenants/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return parseGatewayResponse<GatewayTenant>(response);
}

export async function getGatewayStudents(accessToken: string): Promise<GatewayStudent[]> {
  const response = await gatewayFetch("/students", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return parseGatewayResponse<GatewayStudent[]>(response);
}

export async function createGatewayStudent(
  input: {
    name: string;
    time: string;
    feesAmount: number;
    feesType: string;
    course: string;
    level: string;
    session: string;
    paymentDate?: string;
  },
  accessToken: string,
): Promise<GatewayStudent> {
  const response = await gatewayFetch("/students", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseGatewayResponse<GatewayStudent>(response);
}
