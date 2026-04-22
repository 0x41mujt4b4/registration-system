import { createSchema } from "graphql-yoga";
import { resolvers } from "@/server/graphql/resolvers";
import { typeDefs } from "@/server/graphql/typeDefs";

export const schema = createSchema({
  typeDefs,
  resolvers,
});
