import {FastifyInstance} from 'fastify'
import { sessionRoutes } from './session-routes'
import { userRoutes } from './users-routes'

export const webApiRoutes = async (fastify: FastifyInstance) => {
    await fastify.register(userRoutes, { prefix: "/users" })
    await fastify.register(sessionRoutes, { prefix: "/sessions" })
}