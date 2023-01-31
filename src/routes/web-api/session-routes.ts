import { FastifyInstance } from "fastify";
import Session from "../../entities/session";
import { getAppDataSourceInitialized } from "../../lib/typeorm";
import SessionRepository from "../../repositories/sessionRepository";
import UserRepository from "../../repositories/userRepository";
import * as CreateSessionRequestBody from "../../schemas/createSessionRequestBody.json";
import { CreateSessionRequestBody as CreateSessionRequestBodyInterface } from "../../types/createSessionRequestBody";

export const sessionRoutes = (fastify: FastifyInstance) => {
  fastify.post<{
    Body: CreateSessionRequestBodyInterface;
  }>(
    "",
    {
      schema: {
        body: CreateSessionRequestBody,
        response: {},
      },
    },
    async (req, res) => {
      const appDataSource = await getAppDataSourceInitialized();
      const userRepository = new UserRepository(appDataSource);
      const user = await userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(404).send({ message: "Bad credentials" });
      }

      const isPasswordValid = await user.isPasswordValid(req.body.password);
      if (!isPasswordValid) {
        return res.status(404).send({ message: "Bad credentials" });
      }

      const sessionRepository = new SessionRepository(appDataSource);
      const session = new Session();
      session.user = user;
      const dbbSession = await sessionRepository.add(session);

      return res
        .setCookie("session", dbbSession.token, {
          signed: true,
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .send({});
    }
  );

  fastify.delete('/current', {}, async (request, response) => {
    const session = request.session as Session;
    session.revokedAt = new Date();

    const appDataSource = await getAppDataSourceInitialized();
    const sessionRepository = new SessionRepository(appDataSource);
    const _ = sessionRepository.save(session) // inutile d'attendre
    return response.send({status: 'destroyed'});
  })

  return fastify;
};
