import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { assert } from 'chai'
import User from './../../entities/user'
import {runDataSource} from './../../lib/typeorm'
import userRepository from '../../repositories/userRepository'
import {QueryFailedError} from 'typeorm'

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

        const userInBDD = await userRepository.findByFirstname('Jean');
        assert.equal(user.email, userInBDD?.email);
    })

    it('should raise error if email is missing', async function () {
      const user = new User("Jean", "Marc", "azhkjazhkj62")
      await chai.expect(userRepository.add(user)).to.eventually.be.rejectedWith(QueryFailedError, "Field 'email' doesn't have a default value")
    })
  })
})