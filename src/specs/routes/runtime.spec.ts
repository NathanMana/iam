import { describe } from "mocha";
import fastify from 'fastify'
import { assertsResponseSchemaPresenceHook } from "../../lib/fastify";
import assert = require("assert");

describe("Testing runtime configuration", () => {
    it("Should fail because no schema response", () => {
        const server = fastify({logger: false});
        server.addHook("onRoute", assertsResponseSchemaPresenceHook)

        assert.throws(() => {
            server.get('/test', () => {
                return {statusMessage: 'ok'};
            });
        })
    })


    it("Should works when schema response", () => {
        const server = fastify({logger: false});
        server.addHook("onRoute", assertsResponseSchemaPresenceHook)
        server.addSchema({
            $id: 'schemaId',
            type: 'object',
            properties: {
              messageStatus: { type: 'string' },
              status: {type: 'number'}
            },
            additionalProperties: false,
        });
        const responseSchema = server.getSchema('schemaId');

        assert.doesNotThrow(() => {
            server.get(
                '/test', 
                {
                    schema: {
                        response: responseSchema
                    }
                },  
                () => {
                    return {messageStatus: 'ok'};
                });
        })
    })
})