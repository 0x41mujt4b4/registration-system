import { NextRequest } from "next/server";
import { createYoga } from "graphql-yoga";
import { schema } from "@/server/graphql";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export async function GET(request: NextRequest): Promise<Response> {
  return handleRequest(request, {});
}

export async function POST(request: NextRequest): Promise<Response> {
  return handleRequest(request, {});
}

export async function OPTIONS(request: NextRequest): Promise<Response> {
  return handleRequest(request, {});
}
