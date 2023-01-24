import * as CreateUserRequestBody from "../../schemas/createUserRequestBody.json";
import * as CreateUserResponseBody from "../../schemas/createUserResponseBody.json";
import { CreateUserRequestBody as CreateUserRequestBodyInterface } from "../../types/createUserRequestBody";
import UserRepository from "../../repositories/userRepository";
import { getAppDataSourceInitialized } from "../../lib/typeorm";
import User from "../../entities/user";
import { FastifyInstance } from "fastify";

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

  return fastify;
};
