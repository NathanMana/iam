import { error } from "console";
import fastify, { RouteOptions } from "fastify";
import { RuntimeError } from "../errors/runtime-error";
import { webApiRoutes } from "../routes/web-api/web-api-routes";

// export const server = fastify({logger: true})
//     .register(webApiRoutes, { prefix: '/web-api' })

export const server = fastify({ 
    logger: true,
    ajv: {
        customOptions: {
            removeAdditional: false
        }
    } 
  })
  .addHook("onRoute", assertsResponseSchemaPresenceHook)
  .register(webApiRoutes, {
    prefix: "/web-api",
  })

/**
 * Vérifie si nous tentons d'enregistrer des routes sans schema de réponse
 */
export function assertsResponseSchemaPresenceHook(routeOptions: RouteOptions) {
  if ((routeOptions.method === 'PUT' || routeOptions.method === 'PATCH' || routeOptions.method === 'POST') &&(!routeOptions.schema?.body ))
    throw new RuntimeError("schema is not valid", routeOptions.url)
  else if (!routeOptions.schema?.params || !routeOptions.schema?.querystring)
    throw new RuntimeError("schema is not valid", routeOptions.url)
  if (!routeOptions.schema?.response)
    throw new RuntimeError("No response schema for route", routeOptions.url);
}


