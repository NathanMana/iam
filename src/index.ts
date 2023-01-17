import { getAppDataSource } from "./lib/typeorm";
import { server } from "./lib/fastify";
import { FASTIFY_ADDR, FASTIFY_PORT } from "./lib/dotenv";

export async function run() {
  await getAppDataSource().initialize()
  await server.listen({ port: FASTIFY_PORT, host: FASTIFY_ADDR })
}

run().catch(console.error)