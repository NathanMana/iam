import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { assert } from "chai";
import User from "./../../entities/user";
import { getAppDataSource } from "./../../lib/typeorm";
import UserRepository from "../../repositories/userRepository";
// import { createSessionFixture } from '../fixtures/sessions-fixtures'
import SessionRepository from "../../repositories/sessionRepository";
import { createSessionFixture } from "../fixtures/sessions-fixtures";
chai.use(chaiAsPromised);

describe("Session", function () {
  let userRepository: UserRepository;
  let sessionRepository: SessionRepository;

  before(async function () {
    const dataSource = await getAppDataSource().initialize();
    userRepository = new UserRepository(dataSource);
    sessionRepository = new SessionRepository(dataSource);
  });

  beforeEach(async function () {
    // drop the content of the user table between each it().
    await userRepository.truncate();
    await sessionRepository.truncate();
  });

  describe("Session creation", () => {
    it("Creation", async () => {
      await createSessionFixture();

      // Try to retrieve the session in database
      const session = await sessionRepository.findFirst();
      assert.isNotNull(session);
    });

    it("Should reference an existing user", async () => {
      await createSessionFixture();
      const session = await sessionRepository.findFirst();
      if (!session) return;

      assert.isNotNull(session.user);
    });

    it("ExpiredAt has value", async () => {
      await createSessionFixture();
      const session = await sessionRepository.findFirst();
      if (!session) return;

      assert.isNotNull(session.expiresAt);
    });

    it("Token has value", async () => {
      await createSessionFixture();
      const session = await sessionRepository.findFirst();
      if (!session) return;

      assert.isNotNull(session.token);
    });
  });
});
