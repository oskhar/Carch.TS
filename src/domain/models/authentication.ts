export interface AuthenticationRequestModel {}
export interface AuthenticationResponseModel {
  access_token: string;
  expires_at: Date;
}
export interface AuthenticationPayload {
  id_user: string;
}
