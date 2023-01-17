import {FastifyInstance} from 'fastify'
import { userRoutes } from './users-routes'

export const webApiRoutes = (fastify: FastifyInstance) => {
    return fastify.register(userRoutes, { prefix: "/users" })
}