export interface UserRequestModel {
  name: string;
  email: string;
  password?: string;
  role: string;
  nickname?: string;
}

export interface UserResponseModel {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  nickname?: string;
  email_verif_at?: Date;
  created_at: Date;
  updated_at: Date;
}
