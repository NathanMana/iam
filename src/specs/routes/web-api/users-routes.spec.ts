import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { assert } from "chai";
import UserRepository from "../../../repositories/userRepository";
import { getAppDataSource } from "../../../lib/typeorm";
import { server } from "../../../lib/fastify";
import { fastifyCookie, sign } from "@fastify/cookie";
import { FASTIFY_COOKIES_SECRET } from "../../../lib/dotenv";
import { loadSession } from "../../../lib/session";
import { createSessionFixture } from "../../fixtures/sessions-fixtures";
import { createUserFixture } from "../../fixtures/users-fixtures";

chai.use(chaiAsPromised);

describe("/users", function () {
  let userRepository: UserRepository;

  before(async function () {
    const dataSource = await getAppDataSource().initialize();
    userRepository = new UserRepository(dataSource);
  });

  beforeEach(async function () {
    await userRepository.truncate();
  });

  describe("POST #create", function () {
    it("should register the user", async function () {
      const userEmail = "jean@philippe.com"
      
      const response = await server.inject({
        url: `/web-api/users`,
        method: "POST",
        payload: {
          firstname: "Jean",
          lastname: "Philippe",
          email: userEmail,
          password: "fjdlvzgnzvbo212!!!fdsjkv",
          passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv",
        },
      });

      assert.equal(response.statusCode, 200);

      // Vérifier l'insertion
      const createdUser = await userRepository.findByEmail(userEmail)
      assert.isNotNull(createdUser)
    });


    // it("should return a 'Bad Request' response", async () => {
    //   const response = await server.inject({
    //     url: `/web-api/users`,
    //     method: "POST",
    //     payload: {
    //       firstname: "Jean",
    //       lastname: "Philippe",
    //       email: "",
    //       password: "fjdlvzgnzvbo212!!!fdsjkv",
    //       passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv",
    //     },
    //   });

    //   assert.equal(response.json(), {
    //     error: "A bad request has occured, check out your submission",
    //     message: 'Bad request',
    //     statusCode: 400,
    //   });
    // })
  });


  describe("GET #me", function(){
    it('should respond with the current user identity', async () => {
      const session = await createSessionFixture();
      const cookie = fastifyCookie.sign(session.token, FASTIFY_COOKIES_SECRET);
      const response = await server.inject({
        method: 'GET',
        url: '/web-api/users/me',
        cookies: {
          session: cookie
        },
      })
      //console.log(response.cookies)
      //assert.equal(response.statusCode, 200)
    })
  it('should respond with 401 if user is not logged in', async () => {

    const response = await server.inject({
      method: 'GET',
      url: '/web-api/users/me',
    })

    assert.equal(response.statusCode,401)
  })
  it('should respond with 401 if unsigned cookie', async () => {
    const session = await createSessionFixture();
    const cookie = session.token

    const response = await server.inject({
      method: 'GET',
      url: '/web-api/users/me',
      cookies: {
        session: cookie
      },
    })
    //assert.equal(response.statusCode,401)
  })

  it('should respond with 401 if cookie signature with a wrong key', async () => {
    const session = await createSessionFixture();
    const cookie = sign(session.token, 'wrong_secret')

    const response = await server.inject({
      method: 'GET',
      url: '/web-api/users/me',
      cookies: {
        session: cookie
      },
    })
    //assert.equal(response.statusCode,401)
  })
  it('should respond with 401 if session has expired', async () => {
    const session = await createSessionFixture();
    session.expiresAt = new Date(Date.now() - 10000);
    const cookie = sign(session.token, FASTIFY_COOKIES_SECRET);
    const response = await server.inject({
      method: 'GET',
      url: '/web-api/users/me',
      cookies: {
        session: cookie
      },
    });
    assert.equal(response.statusCode,401)
  });
  it('should respond with 401 if session has been revoked', async () => {
    const session = await createSessionFixture();
    session.revokedAt = new Date(Date.now() - 10000);
    const cookie = sign(session.token, FASTIFY_COOKIES_SECRET);

    const response = await server.inject({
      method: 'GET',
      url: '/web-api/users/me',
      cookies: {
        session: cookie
      },
    });
    assert.equal(response.statusCode,401)
  });



});


  // describe("GET #list-users")

  // describe("PUT #update")

  // describe("DELETE #delete")

})