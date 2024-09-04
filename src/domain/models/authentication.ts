/**
 * request model
 */
export interface AuthenticationRequestModel {
  email: string;
  password: string;
}

/**
 * response model
 */
export interface AccessToken {
  token: string;
  expires_at: Date;
}
export interface RefreshToken {
  token: string;
  expires_at: Date;
}
export interface AuthenticationResponseModel {
  access_token: AccessToken;
  refresh_token: RefreshToken;
}

/**
 * inside token
 */
export interface AuthenticationPayload {
  user_id: string;
}
