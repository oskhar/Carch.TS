import { SignedToken } from "../../../domain/models/authentication";

export interface JwtToken {
  signAccessToken(userId: string): SignedToken;
  signRefreshToken(userId: string): SignedToken;
  verify(jwtToken: string, isAccessToken?: boolean): string;
}
