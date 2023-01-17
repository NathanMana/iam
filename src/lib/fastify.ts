import fastify, {RouteOptions} from "fastify";
import { RuntimeError } from "../errors/runtime-error";
import { webApiRoutes } from "../routes/web-api/web-api-routes";

// export const server = fastify({logger: true})
//     .register(webApiRoutes, { prefix: '/web-api' })

export const server = fastify({ logger: true })
    .addHook('onRoute', assertsResponseSchemaPresenceHook)
    .register(webApiRoutes, {
        prefix: "/web-api",
    });

/**
 * Vérifie si nous tentons d'enregistrer des routes sans schema de réponse
 */
export function assertsResponseSchemaPresenceHook(routeOptions: RouteOptions) {
    if (!routeOptions.schema?.response) throw new RuntimeError("No response schema for route", routeOptions.url)
}
