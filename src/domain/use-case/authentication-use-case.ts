import { AuthenticationRepository } from "../interfaces/repositories/authentication-repository";
import { AuthenticationUseCase } from "../interfaces/use-case/authentication-use-case";
import {
  AuthenticationResponseModel,
  AuthenticationRequestModel,
  AuthenticationPayload,
} from "../models/authentication";
import { JwtToken } from "@/infrastructure/interfaces/security/jwt-token";
import { UserResponseModel } from "../models/user";
import { UserRepository } from "../interfaces/repositories/user-repository";
import { BCryptAdapter } from "@/infrastructure/security/bcrypt-adapter";
import { PasswordHashing } from "@/infrastructure/interfaces/security/password-hashing";
import { jwtTokenAdapterSingleton } from "@/infrastructure/security/jwt-adapter";
import { Unauthenticated } from "@/errors/exceptions/unauthenticated";
import { NotFound } from "@/errors/exceptions/not-found";

export class AuthenticationUseCaseImpl implements AuthenticationUseCase {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordHashing: PasswordHashing = new BCryptAdapter(),
    private readonly jwtToken: JwtToken = jwtTokenAdapterSingleton
  ) {}
  async login(
    data: AuthenticationRequestModel
  ): Promise<AuthenticationResponseModel> {
    const user = await this.userRepository.getOne({
      email: data.email,
    });

    if (!user || !user.password)
      throw new Unauthenticated("Email or password was wrong");

    const validatedPassword = this.passwordHashing.compare(
      data.password,
      user.password
    );

    if (!validatedPassword)
      throw new Unauthenticated("Email or password was wrong");

    const tokenValue: AuthenticationPayload = { user_id: user.id };

    return {
      access_token: this.jwtToken.signAccessToken(tokenValue),
      refresh_token: this.jwtToken.signRefreshToken(tokenValue),
    };
  }

  async refresh(): Promise<AuthenticationResponseModel> {
    throw new NotFound("Method not implemented");
  }

  async me(): Promise<UserResponseModel> {
    throw new Error("Method not implemented.");
  }

  async logout(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async saveToken(): Promise<void> {}
}
