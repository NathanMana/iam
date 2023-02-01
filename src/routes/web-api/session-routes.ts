import { use } from "chai";
import { FastifyInstance } from "fastify";
import Session from "../../entities/session";
import { saveSession } from "../../lib/session";
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
      await saveSession(res, user);
      return res
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
