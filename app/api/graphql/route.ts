import { NextRequest } from "next/server";
import { createYoga } from "graphql-yoga";
import { schema } from "@/server/graphql";
import { auth } from "@/auth";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth();
  return handleRequest(request, { session });
}

export async function POST(request: NextRequest): Promise<Response> {
  const session = await auth();
  return handleRequest(request, { session });
}

export async function OPTIONS(request: NextRequest): Promise<Response> {
  const session = await auth();
  return handleRequest(request, { session });
}
