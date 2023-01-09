import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { assert } from 'chai'
import User from './../../entities/user'
import {getAppDataSource} from './../../lib/typeorm'
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

  describe('validations', function () {
    it('should create a new User in database', async () => {
      const user = new User("Jean", "Marc", "jean@marc.fr")
      await user.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv", passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv"})
      await userRepository.add(user)
      const userInBDD = await userRepository.findByFirstname(user.firstname);

      assert.equal(user.email, userInBDD?.email);
    });

    it('should raise error if email is missing', async function () {
      const user = new User("Jean", "Marc")
      await user.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv", passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv"})
      await chai.expect(userRepository.add(user))
        .to.eventually.be.rejected.and.deep.include({
          target: user,
          property: "email",
          constraints: { isNotEmpty: "email should not be empty" },
        });
    });

    it('should create User with lowercase email', async () => {
      const user = new User("Jean", "Marc", "JEAN@MARC.FR")
      await user.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv", passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv"})
      await userRepository.add(user)
      const userInBDD = await userRepository.findByFirstname('Jean')
      assert.equal(userInBDD?.email, "jean@marc.fr");
    })

    it('cannot create two users with same email', async () => {
      const user = new User("Jean", "Marc", "JEAN@MARC.FR")
      const user2 = new User("Jean2", "Marc2", "jean@marc.fr")
      await user.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv", passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv"})
      await user2.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv2", passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv2"})
      await userRepository.add(user)
      await chai
        .expect(userRepository.add(user2))
        .to.eventually.be.rejected.and.deep.include({
          property: 'email',
          constraints: {UniqueInColumnConstraint: 'Email should be unique'}
        })
    })
  })

  describe('Password', function() {
    it('should be hashed', async () => {
      const user = new User("Jean", "Marc", "JEAN@MARC.FR");
      await user.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv", passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv"})
      await userRepository.add(user)
      chai.expect(user.passwordHash).not.to.be.equal('fjdlvzgnzvbo212!!!fdsjkv')
    });

    it('should throw a ValidationError if the password does not match', async () => {
      const user = new User("Jean", "Marc", "JEAN@MARC.FR");
      await chai.expect(user.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv", passwordConfirmation: "fjdlvzgnzvbo212!!!"})).to.be.eventually.rejected;
    });

    it('should have at least 80 bits of entropy', async () => {
      const user = new User("Jean", "Marc", "JEAN@MARC.FR")
      await chai.expect(user.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv", passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv"})).to.be.eventually.fulfilled;
      await chai.expect(user.setPassword({password: "az", passwordConfirmation: "az"})).to.be.eventually.rejected;
    })

    it('should be valid', async () => {
      const user = new User("Jean", "Marc", "JEAN@MARC.FR");
      await user.setPassword({password: "fjdlvzgnzvbo212!!!fdsjkv", passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv"})
      await userRepository.add(user)
      chai.expect(await user.isPasswordValid('fjdlvzgnzvbo212!!!fdsjkv')).to.be.true
      chai.expect(await user.isPasswordValid('fjdlvzgnzvbo212!!!fdsjkv2')).to.be.false
    });
  });
})
