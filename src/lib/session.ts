import { unsign } from '@fastify/cookie'
import { use } from 'chai'
import { verify } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { DataSource } from 'typeorm'
import Session from '../entities/session'
import User from '../entities/user'
import { SessionError } from '../errors/session-error'
import SessionRepository from '../repositories/sessionRepository'
import { buildUserFixture } from '../specs/fixtures/users-fixtures'
import { FASTIFY_COOKIES_SECRET } from './dotenv'
import { getAppDataSourceInitialized } from './typeorm'

declare module 'fastify' {
  interface FastifyRequest {
    session?: Session | null
    user?: User | null
  }
}

export async function saveSession(reply: FastifyReply, user: User) {
    const appDataSource= getAppDataSourceInitialized()
    const sessionRepository = new SessionRepository(await appDataSource);
    const session = new Session();
    session.user = user;
    const dbbSession = await sessionRepository.add(session);
    await reply
        .setCookie("session", dbbSession.token, {
          signed: true,
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .send({});
}

export async function loadSession(request: FastifyRequest) {
    const appDataSource= getAppDataSourceInitialized()
    const sessionRepository = new SessionRepository(await appDataSource);
    const cookie = request.cookies["session"]
    if (cookie == undefined) 
        return
    const unsignResponse = unsign(cookie, FASTIFY_COOKIES_SECRET) 
    if (!unsignResponse.valid)
        throw new SessionError("unsign response is undefined")
    const token = unsignResponse.value
    if (token != null){
        const session = await sessionRepository.findOneByToken(token)
        request.session = session
        request.user = session?.user
    }
}