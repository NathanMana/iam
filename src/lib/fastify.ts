import * as cookies from '@fastify/cookie'
import fastify, { FastifyError, FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { ValidationError } from "class-validator";
import { EntityNotFoundError } from "typeorm";
import { RuntimeError } from "../errors/runtime-error";
import { webApiRoutes } from "../routes/web-api/web-api-routes";
import { FASTIFY_COOKIES_SECRET } from "./dotenv";

export const server = fastify({ 
    logger: false,
    ajv: {
        customOptions: {
            removeAdditional: false
        }
    } 
  })
  .setErrorHandler(errorHandler)
  .addHook("onRoute", assertsResponseSchemaPresenceHook)
  .register(webApiRoutes, {
    prefix: "/web-api",
  })
  .register(cookies, {
    secret: FASTIFY_COOKIES_SECRET,
    hook: 'onRequest'
  });

/**
 * Vérifie si nous tentons d'enregistrer des routes sans schema de réponse
 */
export function assertsResponseSchemaPresenceHook(routeOptions: RouteOptions) {
  if (!routeOptions.schema?.response)
    throw new RuntimeError("No response schema for route", routeOptions.url);
}


/**
 * Gère les cas d'erreurs générés par le serveur
 */
export async function errorHandler(error : FastifyError, _: FastifyRequest , reply: FastifyReply) {
  const statusCode = error.statusCode;
  
  if (error instanceof ValidationError || error instanceof EntityNotFoundError) {
    return reply.send({
      statusCode: 400,
      message: 'Bad request',
      error: "A bad request has occured, check out your submission"
    });
  }

  if (!statusCode || statusCode < 500) return reply.send(error);

  await reply.send({
    statusCode: 500,
    message: 'An error has occured',
    error: "Internal Server Error"
  });
}