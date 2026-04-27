type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{
    message?: string;
    locations?: unknown;
    path?: unknown;
    extensions?: unknown;
  }>;
};

function summarizeQuery(query: string): string {
  const trimmed = query.trim().replace(/\s+/g, " ");
  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
}

function logGraphQLClientFailure(context: {
  phase: string;
  httpStatus: number;
  httpOk: boolean;
  userFacingMessage: string;
  querySummary: string;
  variableKeys: string[];
  errors?: GraphQLResponse<unknown>["errors"];
  data?: unknown;
  fetchError?: unknown;
}): void {
  const { phase, httpStatus, httpOk, userFacingMessage, querySummary, variableKeys, errors, data, fetchError } =
    context;
  console.warn(
    `[GraphQL client] ${phase}`,
    {
      httpStatus,
      httpOk,
      userFacingMessage,
      querySummary,
      variableKeys,
      graphQLErrors: errors ?? null,
      data: data ?? null,
      fetchError:
        fetchError instanceof Error
          ? { name: fetchError.name, message: fetchError.message, stack: fetchError.stack }
          : fetchError ?? null,
    },
  );
}

export type GraphQLResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function formatGraphQLErrorMessages(errors: unknown): string {
  if (!Array.isArray(errors) || errors.length === 0) {
    return "";
  }
  return errors
    .map((entry) => {
      if (entry && typeof entry === "object" && typeof (entry as { message?: unknown }).message === "string") {
        return (entry as { message: string }).message;
      }
      return "";
    })
    .filter(Boolean)
    .join("; ");
}

export function toUserFriendlyErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Unknown error";
  const normalized = raw.toLowerCase();

  if (normalized.includes("missing required permissions") || normalized.includes("insufficient role")) {
    return "You do not have permission to perform this action.";
  }
  if (normalized.includes("authentication required") || normalized.includes("unauthorized") || normalized.includes("401")) {
    return "Your session expired or you are not authenticated. Please sign in again.";
  }
  if (normalized.includes("forbidden") || normalized.includes("403")) {
    return "Access denied. You do not have permission for this page or action.";
  }
  if (normalized.includes("failed to fetch") || normalized.includes("networkerror")) {
    return "Cannot reach the server right now. Please check your connection and try again.";
  }
  if (normalized.includes("validation") || normalized.includes("bad request") || normalized.includes("400")) {
    return "Some submitted values are invalid. Please review the form and try again.";
  }
  if (normalized.includes("500")) {
    return "A server error occurred. Please try again in a moment.";
  }

  return raw || "Something went wrong. Please try again.";
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<GraphQLResult<T>> {
  const querySummary = summarizeQuery(query);
  const variableKeys = Object.keys(variables);

  let res: Response;
  try {
    res = await fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (fetchError) {
    const userFacingMessage = "Failed to fetch";
    logGraphQLClientFailure({
      phase: "network_or_cors",
      httpStatus: 0,
      httpOk: false,
      userFacingMessage,
      querySummary,
      variableKeys,
      fetchError,
    });
    return { success: false, error: userFacingMessage };
  }

  let json: GraphQLResponse<T>;
  try {
    json = (await res.json()) as GraphQLResponse<T>;
  } catch (parseError) {
    const userFacingMessage = `Invalid response from server (status ${res.status})`;
    logGraphQLClientFailure({
      phase: "json_parse",
      httpStatus: res.status,
      httpOk: res.ok,
      userFacingMessage,
      querySummary,
      variableKeys,
      fetchError: parseError,
    });
    return { success: false, error: userFacingMessage };
  }

  if (!res.ok) {
    const fromBody = formatGraphQLErrorMessages(json.errors);
    const userFacingMessage = fromBody || `GraphQL request failed with status ${res.status}`;
    logGraphQLClientFailure({
      phase: "http_error",
      httpStatus: res.status,
      httpOk: res.ok,
      userFacingMessage,
      querySummary,
      variableKeys,
      errors: json.errors,
      data: json.data,
    });
    return {
      success: false,
      error: userFacingMessage,
    };
  }

  const errorText = formatGraphQLErrorMessages(json.errors);
  if (errorText) {
    logGraphQLClientFailure({
      phase: "graphql_errors",
      httpStatus: res.status,
      httpOk: res.ok,
      userFacingMessage: errorText,
      querySummary,
      variableKeys,
      errors: json.errors,
      data: json.data,
    });
    return { success: false, error: errorText };
  }

  if (json.data === undefined) {
    const userFacingMessage = "No data returned from server.";
    logGraphQLClientFailure({
      phase: "missing_data",
      httpStatus: res.status,
      httpOk: res.ok,
      userFacingMessage,
      querySummary,
      variableKeys,
      errors: json.errors,
      data: json.data,
    });
    return { success: false, error: userFacingMessage };
  }

  return { success: true, data: json.data };
}
