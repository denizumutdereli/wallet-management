// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsEmail, IsString, MinLength, IsEnum, Min } from 'class-validator';
// import i18n from '@/i18n';

export class LoginRequest {
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;
}

export class LoginResponse {
  cookie: string;
  //user: UserDTO;
  token: any;
}

export class AuthUserRequest {
  @IsEmail()
  public email?: string;

  @IsString()
  public password?: string;
}

export class AuthUserResponse {
  verified: boolean;
}

export class ByeReponse {
  status: boolean;
  message: string;
}
