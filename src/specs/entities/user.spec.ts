import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { assert, use } from 'chai'
import User from './../../entities/user'
import {runDataSource} from './../../lib/typeorm'
import userRepository from '../../repositories/userRepository'
import { QueryFailedError } from 'typeorm'
import { ValidationError } from 'class-validator'

chai.use(chaiAsPromised)

describe('User', function () {
  before(async function () {
    // initialise the datasource (database connection)
    await runDataSource()
  })
    
  beforeEach(async function () {
    // drop the content of the user table between each it().
    await userRepository.truncate()
  })

  describe('validations', function () {
    it('should create a new User in database', async () => {
        const user = new User("Jean", "Marc", "azhkjazhkj62", "jean@marc.fr")
        await userRepository.add(user)

        const userInBDD = await userRepository.findByFirstname('Jean')
        assert.equal(user.email, userInBDD?.email)
    })

    it('should raise error if email is missing', async function () {
      const user = new User("Jean", "Marc", "azhkjazhkj62")
      await chai.expect(userRepository.add(user))
        .to.eventually.be.rejected.and.deep.include({
          target: user,
          property: 'email',
          constraints: { isNotEmpty: 'email should not be empty' }
        })
    })

    it('should create User with lowercase email', async () => {
      const user = new User("Jean", "Marc", "azhkjazhkj62", "JEAN@MARC.FR")
      await userRepository.add(user)

      const userInBDD = await userRepository.findByFirstname('Jean')
      assert.equal(userInBDD?.email, "jean@marc.fr");
    })

    it('cannot create two users with same email', async () => {
      const user = new User("Jean", "Marc", "azhkjazhkj62", "JEAN@MARC.FR")
      const user2 = new User("Jean2", "Marc2", "azhkjazhkj62v2", "jean@marc.fr")
      await userRepository.add(user)
      await chai.expect(userRepository.add(user2)).to.be.eventually.rejectedWith(QueryFailedError)
    })
  })

  describe('setPassword', function() {
    it('should hash the password', async () => {
      const user = new User("Jean", "Marc", "azhkjazhkj62", "JEAN@MARC.FR");
      await user.setPassword({password: "password", passwordConfirmation: "password"})
      chai.expect(user.passwordHash).not.to.be.equal('password')
    });

    it('should throw a ValidationError if the password does not match', async () => {
      const user = new User("Jean", "Marc", "azhkjazhkj62", "JEAN@MARC.FR");
      await user.setPassword({password: "password", passwordConfirmation: "password"})
      chai.expect(user.setPassword({password: "password", passwordConfirmation: "password"})).to.be.eventually.rejectedWith(ValidationError);
    });
  });
})