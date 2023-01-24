import Session from '../../entities/session.js'
import User from '../../entities/user.js'
import { getAppDataSourceInitialized } from '../../lib/typeorm.js'
import { buildUserFixture } from './users-fixtures.js'

type SessionFixtureOptions = { user?: User }

export function buildSessionFixture(opts: SessionFixtureOptions = {}) {
  const session = new Session()
  session.user = opts.user ?? buildUserFixture()
  return session
}

export async function createSessionFixture(opts: SessionFixtureOptions = {}) {
  return (await getAppDataSourceInitialized()).getRepository(Session).save(buildSessionFixture(opts));
}