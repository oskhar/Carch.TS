import {
  AuthenticationPayload,
  AuthenticationResponseModel,
} from "../../../domain/models/authentication";

export interface JwtToken {
  signAccessToken(data: AuthenticationPayload): AuthenticationResponseModel;
  signRefreshToken(data: AuthenticationPayload): AuthenticationResponseModel;
  verify(jwtToken: string, isAccessToken?: boolean): AuthenticationPayload;
}
