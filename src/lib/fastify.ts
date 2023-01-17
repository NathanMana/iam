import fastify from 'fastify'
import { webApiRoutes } from '../routes/web-api/web-api-routes';

// export const server = fastify({logger: true})
//     .register(webApiRoutes, { prefix: '/web-api' })

export const server = fastify({logger: true})
    .register(webApiRoutes, { prefix: '/web-api'})