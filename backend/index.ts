import 'reflect-metadata';
import path from "path";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";

import { HelloResolver, UserResolver } from './src/resolvers';

;(async function main() {
  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  });
  const server = new ApolloServer({ schema });
  const { url } = await server.listen();
  console.log(`Server is running, GraphQL Playground available at ${url}`) 
})()
