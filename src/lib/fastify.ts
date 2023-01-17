import Fastify from 'fastify'

export const server = Fastify({logger: true})

export function getFastify() {
    return Fastify({
        logger: true
    })
}