import Fastify from 'fastify'

export function getSatisfy() {
    return Fastify({
        logger: true
    })
}