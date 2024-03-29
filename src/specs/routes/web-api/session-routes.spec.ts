import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { getAppDataSource } from "../../../lib/typeorm";
import UserRepository from "../../../repositories/userRepository";
import { buildUserFixture } from "../../fixtures/users-fixtures";
import { server } from "../../../lib/fastify";
import { assert } from 'chai'
import { createSessionFixture } from "../../fixtures/sessions-fixtures";
import fastifyCookie = require("@fastify/cookie");
import { FASTIFY_COOKIES_SECRET } from "../../../lib/dotenv";
chai.use(chaiAsPromised);

describe("/sessions", function () {
  let userRepository: UserRepository;

  before(async function () {
    const dataSource = await getAppDataSource().initialize();
    userRepository = new UserRepository(dataSource);
  });

  beforeEach(async function () {
    await userRepository.truncate();
  });

  it('POST #create', async () => {
    const user = buildUserFixture();
    const password = "fjdlvzgnzvbo212!!!fdsjkv";

    await server.inject({
        url: '/web-api/users',
        method: 'POST',
        payload: {
            email: user.email,
            password: password,
            passwordConfirmation: password,
            firstname: user.firstname,
            lastname: user.lastname
        }
    })

    const response = await server.inject({
        url: '/web-api/sessions',
        method: 'POST',
        payload: {
            email: user.email,
            password: password
        }
    })

    assert.isNotNull(response.cookies[0]) // il n'y a qu'un seul cookie
  })

  it('should create a session after lowering email', async () => {
    const user = buildUserFixture();
    user.email = user.email.toUpperCase();
    const password = "fjdlvzgnzvbo212!!!fdsjkv";

    await server.inject({
        url: '/web-api/users',
        method: 'POST',
        payload: {
            email: user.email,
            password: password,
            passwordConfirmation: password,
            firstname: user.firstname,
            lastname: user.lastname
        }
    })

    const response = await server.inject({
        url: '/web-api/sessions',
        method: 'POST',
        payload: {
            email: user.email,
            password: password
        }
    })

    assert.isNotNull(response.cookies[0]) // il n'y a qu'un seul cookie
  })

  it('should reject with 404 if email not found', async () => {
    const user = buildUserFixture();
    const password = "fjdlvzgnzvbo212!!!fdsjkv";

    await server.inject({
        url: '/web-api/users',
        method: 'POST',
        payload: {
            email: user.email,
            password: password,
            passwordConfirmation: password,
            firstname: user.firstname,
            lastname: user.lastname
        }
    })

    const response = await server.inject({
        url: '/web-api/sessions',
        method: 'POST',
        payload: {
            email: "jean@email.com",
            password: password
        }
    })

    assert.equal(response.statusCode, 404)
  })
  it('should reject with 404 if password does not match', async () => {
    const user = buildUserFixture();
    const password = "fjdlvzgnzvbo212!!!fdsjkv";

    await server.inject({
        url: '/web-api/users',
        method: 'POST',
        payload: {
            email: user.email,
            password: password,
            passwordConfirmation: password,
            firstname: user.firstname,
            lastname: user.lastname
        }
    })

    const response = await server.inject({
        url: '/web-api/sessions',
        method: 'POST',
        payload: {
            email: user.email,
            password: "randomPassword"
        }
    })

    assert.equal(response.statusCode, 404)
  })


  it("Should delete session", async() => {
    const session = await createSessionFixture();
    const cookie = fastifyCookie.sign(session.token, FASTIFY_COOKIES_SECRET);

    const response = await server.inject({
        url: '/web-api/sessions/current',
        method: 'DELETE',
        cookies: {
            session: cookie
        }
    })

    assert.equal(response.statusCode, 200);
  })
});
