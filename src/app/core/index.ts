export interface Login {
  login: string;
  password: string;
}

export interface JwtToken {
  token: string;
  otpExpiration: string;
}
