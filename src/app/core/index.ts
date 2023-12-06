export interface Login {
  login: string;
  password: string;
}

export interface JwtToken {
  token: string;
  otpExpiration: string;
}

export interface RegisterUserRequest {
  password?: string;
  full_name: string;
  email: string;
  phone_number: string;
  is_enabled?: boolean;
  two_factor_auth?: boolean;
}

export interface Account {
  id: number;
  name: string;
  date: string;
  user_id: number;
  balance: number;
  currency: string;
  is_blocked: boolean;
}

export interface CreateAccountDto {
  name: string;
  currency: string;
}

export interface UserInfo {
  userId: number;
  iss: string;
  fullName: string;
  twoFactor: boolean;
  sub: string;
  email: string;
}
