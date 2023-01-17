import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
// import { server } from "../../../lib/fastify"
import { assert } from "chai";
import server from "../../../routes/web-api/users-routes";
import UserRepository from "../../../repositories/userRepository";
import { getAppDataSource } from "../../../lib/typeorm";

chai.use(chaiAsPromised);

describe("/web-api/users", function () {
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
          password: "password",
          passwordConfirmation: "password",
        },
      });

      assert.equal(response.statusCode, 200);

      // Vérifier l'insertion
      const createdUser = await userRepository.findByEmail(userEmail)
      assert.isNotNull(createdUser)
    });
  });

  // describe("GET #user")
  // describe("GET #list-users")

  // describe("PUT #update")

  // describe("DELETE #delete")
});
