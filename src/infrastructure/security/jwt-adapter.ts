import jwt from "jsonwebtoken";
import { buildFutureDate } from "../utils/build-future-date";
import { JwtToken } from "../interfaces/security/jwt-token";
import { SignedToken } from "../../domain/models/authentication";

export class JwtTokenAdapter implements JwtToken {
  constructor(
    // These values can be configured in .env file
    private readonly secret: string,
    private readonly refreshSecret: string,
    private readonly accessTokenExpirationInSeconds = 3600, // 1 hours default
    private readonly refreshTokenExpirationInSeconds = 691200 // 8 days default
  ) {}

  signAccessToken(userId: string): SignedToken {
    const expiresAt = buildFutureDate(
      new Date(),
      this.accessTokenExpirationInSeconds
    );
    const accessToken = jwt.sign({ id: userId }, this.secret, {
      expiresIn: this.accessTokenExpirationInSeconds,
    });

    return {
      access_token: accessToken,
      expires_at: expiresAt,
    };
  }

  signRefreshToken(userId: string): SignedToken {
    const expiresAt = buildFutureDate(
      new Date(),
      this.refreshTokenExpirationInSeconds
    );
    const accessToken = jwt.sign({ id: userId }, this.refreshSecret, {
      expiresIn: this.refreshTokenExpirationInSeconds,
    });

    return {
      access_token: accessToken,
      expires_at: expiresAt,
    };
  }

  verify(accessToken: string, isAccessToken: boolean = true): string {
    const secret = isAccessToken ? this.secret : this.refreshSecret;
    const userData = jwt.verify(accessToken, secret) as { id: string };
    return userData.id;
  }
}

export const jwtTokenAdapterSingleton = new JwtTokenAdapter(
  process.env.JWT_SECRET as string,
  process.env.JWT_SECRET_REFRESH as string,
  parseInt(process.env.JWT_SECRET_EXPIRATION_SECS as string),
  parseInt(process.env.JWT_SECRET_REFRESH_EXPIRATION_SECS as string)
);
