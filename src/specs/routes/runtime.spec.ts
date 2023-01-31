import { describe } from "mocha";
import fastify from "fastify";
import {
  assertsResponseSchemaPresenceHook,
  errorHandler,
} from "../../lib/fastify";
import assert = require("assert");
import { server as officialServer } from "../../lib/fastify";
import { CreateUserRequestBody as CreateUserRequestBodyInterface } from "../../types/createUserRequestBody";

describe("Testing runtime configuration", () => {
  it("Should fail because no schema response", () => {
    const server = fastify({ logger: false });
    server.addHook("onRoute", assertsResponseSchemaPresenceHook);

    assert.throws(() => {
      server.get("/test", () => {
        return { statusMessage: "ok" };
      });
    });
  });

  it("Should returns http code 400 when additionnal properties in payload", async () => {
    const response = await officialServer.inject({
      path: "/web-api/users",
      method: "POST",
      payload: {
        test: "salut",
        firstname: "Jean",
        lastname: "Philippe",
        email: "jean@philippe.com",
        password: "fjdlvzgnzvbo212!!!fdsjkv",
        passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv",
      },
    });

    assert.strictEqual(response.statusCode, 400);
  });
  it("Should works when schema response is valid", () => {
    const server = fastify({ logger: false });
    const bodyJsonSchema = {
      type: "object",
      properties: {
        firstname: { type: "string" },
        lastname: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        passwordConfirmation: { type: "string" },
      },
      additionalProperties: false,
      required: [
        "firstname",
        "lastname",
        "email",
        "password",
        "passwordConfirmation",
      ],
    };
    server.addHook("onRoute", assertsResponseSchemaPresenceHook);
    server.addSchema({
      $id: "schemaId",
      type: "object",
      properties: {
        messageStatus: { type: "string" },
        status: { type: "number" },
      },
      additionalProperties: false,
    });
    const responseSchema = server.getSchema("schemaId");
    const queryStringJsonSchema = {
      type: "object",
      properties: {},
    };

    const paramsJsonSchema = {
      type: "object",
      properties: {},
    };

    assert.doesNotThrow(() => {
      server.get(
        "/test",
        {
          schema: {
            querystring: queryStringJsonSchema,
            params: paramsJsonSchema,
            response: responseSchema,
          },
        },
        () => {
          return { messageStatus: "ok" };
        }
      );
    });
  });

  it("Should send error 404", async () => {
    const response = await officialServer.inject({
      path: "random/route",
      method: "GET",
    });

    assert.strictEqual(response.statusCode, 404);
  });

  it("Should return a transformed error 500", async () => {
    const server = fastify({ logger: false }).setErrorHandler(errorHandler);
    server.get("/new", async (_, reply) => {
      await reply.code(parseInt("bad status code")).send({ hello: "world" });
    });

    const response = await server.inject({
      path: "/new",
      method: "GET",
    });

    assert.deepStrictEqual(response.json(), {
      error: "Internal Server Error",
      message: "An error has occured",
      statusCode: 500,
    });
  });
});
