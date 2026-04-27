import type { NextRequest } from "next/server";
import { VISION_GATEWAY_PROXY_SECRET_HEADER } from "@/server/visionGatewayProxyHeader";

export const dynamic = "force-dynamic";

function upstreamBase(): string {
  const raw =
    process.env.VISION_GATEWAY_UPSTREAM_URL ?? process.env.VISION_GATEWAY_BASE_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

async function proxyRequest(req: NextRequest, pathSegments: string[]): Promise<Response> {
  const secret = process.env.VISION_GATEWAY_PROXY_SECRET;
  if (secret && req.headers.get(VISION_GATEWAY_PROXY_SECRET_HEADER) !== secret) {
    return new Response("Forbidden", { status: 403 });
  }

  if (pathSegments.length === 0) {
    return new Response("Bad Request", { status: 400 });
  }

  const path = `/${pathSegments.join("/")}`;
  const target = new URL(path + req.nextUrl.search, upstreamBase());

  const headers = new Headers();
  const authorization = req.headers.get("authorization");
  if (authorization) {
    headers.set("authorization", authorization);
  }
  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  const accept = req.headers.get("accept");
  if (accept) {
    headers.set("accept", accept);
  }

  const method = req.method;
  let body: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await req.arrayBuffer();
  }

  const upstream = await fetch(target, {
    method,
    headers,
    body: body !== undefined && body.byteLength > 0 ? body : undefined,
  });

  const outHeaders = new Headers(upstream.headers);
  return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
}

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handle(req: NextRequest, context: RouteContext): Promise<Response> {
  const { path = [] } = await context.params;
  return proxyRequest(req, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
