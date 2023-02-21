import * as CreateUserRequestBody from "../../schemas/createUserRequestBody.json";
import * as CreateUserResponseBody from "../../schemas/createUserResponseBody.json";
import { CreateUserRequestBody as CreateUserRequestBodyInterface } from "../../types/createUserRequestBody";
import UserRepository from "../../repositories/userRepository";
import { getAppDataSourceInitialized } from "../../lib/typeorm";
import User from "../../entities/user";
import { FastifyInstance } from "fastify";
import Session from "../../entities/session";
import SessionRepository from "../../repositories/sessionRepository";
import { loadSession } from "../../lib/session";
import { verify } from "crypto";

export const userRoutes = (fastify: FastifyInstance) => {

  fastify.post<{
    Body: CreateUserRequestBodyInterface;
  }>(
    "",
    {
      schema: {
        body: CreateUserRequestBody,
        response: { 200: CreateUserResponseBody },
      },
    },
    async (request, response) => {
      const appDataSource = await getAppDataSourceInitialized();
      const userRepository = new UserRepository(appDataSource);

      const user = new User(
        request.body.firstname,
        request.body.lastname,
        request.body.email
      );
      await user.setPassword({
        password: request.body.password,
        passwordConfirmation: request.body.passwordConfirmation,
      });

      const dbbUser = await userRepository.add(user);

      return response.send({
        id: dbbUser.id,
        email: dbbUser.email, 
        lastname: dbbUser.lastname,
        firstname: dbbUser.firstname
      });
    }
  );

  fastify.get('/me', {
    schema: {
      response: { 200: CreateUserResponseBody },
    },
  }, async (request, response) => {
    const now = new Date();
    if (((request.session?.expiresAt) &&(request.session?.expiresAt < now))||(request.session?.revokedAt)) {
      await response.status(401).send({ error: 'Unauthorized' })
      return
    }
    if (!request.user) {
      await response.status(401).send({ error: 'Unauthorized' })
      return
    }
    return response.send({
      id: request.user.id,
      email: request.user.email, 
      lastname: request.user.lastname,
      firstname: request.user.firstname
    });
  })

  return fastify;
};
