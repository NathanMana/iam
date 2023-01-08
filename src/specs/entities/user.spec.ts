import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { assert } from "chai";
import User from "./../../entities/user";
import { getAppDataSource } from "./../../lib/typeorm";
import UserRepository from "../../repositories/userRepository";

chai.use(chaiAsPromised);

describe("User", function () {
  let userRepository: UserRepository;

  before(async function () {
    const dataSource = await getAppDataSource().initialize();
    userRepository = new UserRepository(dataSource);
  });

  beforeEach(async function () {
    // drop the content of the user table between each it().
    await userRepository.truncate();
  });

  describe("validations", function () {
    it("should create a new User in database", async () => {
      const user = new User("Jean", "Marc", "azhkjazhkj62", "jean@marc.fr");
      await userRepository.add(user);

      const userInBDD = await userRepository.findByFirstname(user.firstname);

      assert.equal(user.email, userInBDD?.email);
    });

    it("should raise error if email is missing", async function () {
      const user = new User("Jean", "Marc", "azhkjazhkj62");
      await chai
        .expect(userRepository.add(user))
        .to.eventually.be.rejected.and.deep.include({
          target: user,
          property: "email",
          constraints: { isNotEmpty: "email should not be empty" },
        });
    });

    it("should create User with lowercase email", async () => {
      const user = new User("Jean", "Marc", "azhkjazhkj62", "JEAN@MARC.FR");
      await userRepository.add(user);

      const userInBDD = await userRepository.findByFirstname("Jean");
      assert.equal(userInBDD?.email, "jean@marc.fr");
    });

    it("cannot create two users with same email", async () => {
      const user = new User("Jean", "Marc", "azhkjazhkj62", "JEAN@MARC.FR");
      const user2 = new User(
        "Jean2",
        "Marc2",
        "azhkjazhkj62v2",
        "jean@marc.fr"
      );
      await userRepository.add(user);
      await chai
        .expect(userRepository.add(user2))
        .to.eventually.be.rejected.and.deep.include({
          property: 'email',
          constraints: {UniqueInColumnConstraint: 'Email should be unique'}
        })
    });
  });
});
