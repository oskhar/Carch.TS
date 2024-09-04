import {
  AccessToken,
  AuthenticationPayload,
  RefreshToken,
} from "@/domain/models/authentication";

export interface JwtToken {
  signAccessToken(data: AuthenticationPayload): AccessToken;
  signRefreshToken(data: AuthenticationPayload): RefreshToken;
  verify(jwtToken: string, isAccessToken?: boolean): AuthenticationPayload;
}
