const VISION_GATEWAY_BASE_URL = process.env.VISION_GATEWAY_BASE_URL ?? "http://localhost:3000";
const VISION_GATEWAY_TENANT_DOMAIN = process.env.VISION_GATEWAY_TENANT_DOMAIN ?? "vision.local";

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
  email: string;
};

type GatewayLoginPayload = {
  access_token: string;
};

type DecodedGatewayToken = {
  role?: string;
  permissions?: string[];
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

export async function ensureTenantExists(): Promise<void> {
  const response = await fetch(`${VISION_GATEWAY_BASE_URL}/tenants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: VISION_GATEWAY_TENANT_DOMAIN }),
  });

  if (response.ok || response.status === 409) {
    return;
  }

  await parseGatewayResponse<unknown>(response);
}

export async function createGatewayUser(username: string, password: string): Promise<string> {
  await ensureTenantExists();
  const response = await fetch(`${VISION_GATEWAY_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: username.trim(),
      email: toGatewayEmail(username),
      password,
    }),
  });

  const createdUser = await parseGatewayResponse<GatewayUser>(response);
  return createdUser.id ?? createdUser._id ?? toGatewayEmail(username);
}

export async function loginToGateway(username: string, password: string): Promise<string> {
  // For username-based login (without @domain), make sure the fallback tenant exists.
  if (!username.includes("@")) {
    await ensureTenantExists();
  }

  const response = await fetch(`${VISION_GATEWAY_BASE_URL}/auth/login`, {
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
    const decoded = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(decoded) as DecodedGatewayToken;
  } catch {
    return null;
  }
}

export async function loginToGatewayWithProfile(username: string, password: string): Promise<{
  accessToken: string;
  role: string;
  permissions: string[];
}> {
  const accessToken = await loginToGateway(username, password);
  const decoded = decodeJwtPayload(accessToken);
  return {
    accessToken,
    role: decoded?.role ?? "user",
    permissions: Array.isArray(decoded?.permissions) ? decoded.permissions : [],
  };
}

export async function getGatewayUser(username: string): Promise<{ id: string; username: string } | null> {
  const response = await fetch(
    `${VISION_GATEWAY_BASE_URL}/users?email=${encodeURIComponent(toGatewayEmail(username))}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (response.status === 404) {
    return null;
  }

  const user = await parseGatewayResponse<GatewayUser>(response);
  return {
    id: user.id ?? user._id ?? toGatewayEmail(username),
    username,
  };
}

export async function getGatewayStudents(accessToken: string): Promise<GatewayStudent[]> {
  const response = await fetch(`${VISION_GATEWAY_BASE_URL}/students`, {
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
  const response = await fetch(`${VISION_GATEWAY_BASE_URL}/students`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseGatewayResponse<GatewayStudent>(response);
}
