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

export interface Deposit {
  id: number;
  date: string;
  term: DepositTerm;
  amount: number;
  compensationAmount: number;
  status: DepositStatus,
  type: DepositType,
  userId: number,
  accountId: number
}

export enum DepositTerm {
  ThreeMonth = "MONTH_3",
  SixMonth = "MONTH_6",
  TwelveMonth = "MONTH_12",
  Perpetual = "PERPETUAL"
}

export enum DepositStatus {
  New = "NEW",
  Approve = "APPROVED",
  OnCompensation = "ONCOMPENSATION",
  Closed = "CLOSED"
}

export enum DepositType {
  Revocable = "REVOCABLE",
  Irrevocable = "IRREVOCABLE"
}

export interface CreateDepositDto {
  account_id: number;
  term: DepositTerm,
  amount: number;
  deposit_type: DepositType
}

export interface Credit {
  id: number;
  name: string;
  date: string;
  user_id: number;
  account_id: number;
  term: CreditTerm;
  amount_given: number;
  debt: number;
  next_pay_date: string;
  per_month_pay_sum: number;
  penya: number;
  status: CreditStatus;
  payment_type: CreditPaymentType;
  is_notification_enabled: boolean;
}

export enum CreditTerm {
  ThreeMonth = "MONTH_3",
  SixMonth = "MONTH_6",
  TwelveMonth = "MONTH_12"
}

export enum CreditStatus {
  New = "NEW",
  Approved = "APPROVED",
  Paid = "PAID"
}

export enum CreditPaymentType {
  Auto = "AUTO",
  Manual = "MANUAL"
}

export interface CreateCreditDto {
  name: string;
  account_id: number;
  term: CreditTerm,
  payment_type: CreditPaymentType,
  amount_given: number,
  is_notification_enabled: boolean
}

export interface ConfirmOtpRequest {
  otp_code: number;
}

export interface TransferRequest {
  sender_id: number;
  receiver_id: number;
  sum: number;
  currency: string;
}

export interface ChangeAccountDto {
  name: string
}

export interface MakePaymentRequest {
  sum_to_pay: number;
}

export interface CreditPaymentInfoDto {
  credit_name: string;
  credit_id: number;
  sum_per_month: number;
  penya: number;
  debt_after_payment: number;
  sum_to_pay: number;
}
