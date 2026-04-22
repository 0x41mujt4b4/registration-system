type GraphQLResponse<T> = {
  data: T;
  errors?: Array<{ message: string }>;
};

export async function fetchGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed with status ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors) {
    console.error(json.errors);
    throw new Error(json.errors[0]?.message ?? "GraphQL request failed");
  }

  return json.data;
}
