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
