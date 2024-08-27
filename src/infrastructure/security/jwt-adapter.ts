import jwt from "jsonwebtoken";
import { buildFutureDate } from "../utils/build-future-date";
import { JwtToken } from "../interfaces/security/jwt-token";
import {
  AuthenticationPayload,
  AuthenticationResponseModel,
} from "../../domain/models/authentication";

export class JwtTokenAdapter implements JwtToken {
  constructor(
    private readonly secret: string,
    private readonly refreshSecret: string,
    private readonly accessTokenExpirationInSeconds = 3600,
    private readonly refreshTokenExpirationInSeconds = 691200
  ) {}

  signAccessToken(data: AuthenticationPayload): AuthenticationResponseModel {
    const expiresAt = buildFutureDate(
      new Date(),
      this.accessTokenExpirationInSeconds
    );
    const accessToken = jwt.sign(data, this.secret, {
      expiresIn: this.accessTokenExpirationInSeconds,
    });

    return {
      access_token: accessToken,
      expires_at: expiresAt,
    };
  }

  signRefreshToken(data: AuthenticationPayload): AuthenticationResponseModel {
    const expiresAt = buildFutureDate(
      new Date(),
      this.refreshTokenExpirationInSeconds
    );
    const accessToken = jwt.sign(data, this.refreshSecret, {
      expiresIn: this.refreshTokenExpirationInSeconds,
    });

    return {
      access_token: accessToken,
      expires_at: expiresAt,
    };
  }

  verify(
    accessToken: string,
    isAccessToken: boolean = true
  ): AuthenticationPayload {
    const secret = isAccessToken ? this.secret : this.refreshSecret;
    return jwt.verify(accessToken, secret) as AuthenticationPayload;
  }
}

export const jwtTokenAdapterSingleton = new JwtTokenAdapter(
  process.env.JWT_SECRET as string,
  process.env.JWT_SECRET_REFRESH as string,
  parseInt(process.env.JWT_SECRET_EXPIRATION_SECS as string),
  parseInt(process.env.JWT_SECRET_REFRESH_EXPIRATION_SECS as string)
);
