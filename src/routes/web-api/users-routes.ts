import * as CreateSessionRequestBody from "../../schemas/createSessionRequestBody.json";
import * as CreateUserRequestBody from "../../schemas/createUserRequestBody.json";
import * as CreateUserResponseBody from "../../schemas/createUserResponseBody.json";
import { CreateUserRequestBody as CreateUserRequestBodyInterface } from "../../types/createUserRequestBody";
import { CreateUserResponseBody as CreateUserResponseBodyInterface } from "../../types/createUserResponseBody";
import { CreateSessionRequestBody as CreateSessionRequestBodyInterface } from "../../types/createSessionRequestBody";
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
        password: "fjdlvzgnzvbo212!!!fdsjkv",
        passwordConfirmation: "fjdlvzgnzvbo212!!!fdsjkv",
      });

      await userRepository.add(user);

      return response.send();
    }
  );

  return fastify
};
