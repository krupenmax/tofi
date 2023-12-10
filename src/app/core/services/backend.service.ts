import { Injectable } from '@angular/core';
import { Account, ChangeAccountDto, ConfirmOtpRequest, CreateAccountDto, CreateCreditDto, CreateDepositDto, Credit, CreditPaymentInfoDto, Deposit, JwtToken, Login, MakePaymentRequest, RegisterUserRequest, TransferRequest } from '..';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export const apiUrl = "api";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  public readonly auth = {
    login$: (body: Login): Observable<JwtToken> => this.httpClient.post<JwtToken>(`${apiUrl}/auth/login`, body),

    register$: (body: RegisterUserRequest): Observable<void> => this.httpClient.post<void>(`${apiUrl}/auth/register`, body),

    refreshSMS$: (): Observable<JwtToken> => this.httpClient.get<JwtToken>(`${apiUrl}/auth/refresh_otp`, { withCredentials: true }),

    confirmSMS$: (body: ConfirmOtpRequest): Observable<void> => this.httpClient.post<void>(`${apiUrl}/auth/confirm_otp`, body, { withCredentials: true })
  }

  public readonly accounts = {
    get$: (userId: number): Observable<Account[]> => this.httpClient.get<Account[]>(`${apiUrl}/users/${userId}/accounts`, { withCredentials: true }),

    post$: (body: CreateAccountDto, userId: number): Observable<void> => this.httpClient.post<void>(`${apiUrl}/users/${userId}/accounts`, body, { withCredentials: true }),

    addMoney$: (userId: number, accountId: number): Observable<void> => this.httpClient.get<void>(`${apiUrl}/users/${userId}/accounts/${accountId}/add_money`, { withCredentials: true }),

    makeTransfer$: (body: TransferRequest, userId: number): Observable<void> => this.httpClient.post<void>(`${apiUrl}/users/${userId}/accounts/transfer`, body, { withCredentials: true }),

    changeStatus$: (accountId: number, userId: number, isBlocked: boolean): Observable<void> => {
      const params = { is_blocked: isBlocked };
      return this.httpClient.patch<void>(`${apiUrl}/users/${userId}/account/${accountId}/status`, { }, { params, withCredentials: true });
    },

    changeAccount$: (body: ChangeAccountDto, userId: number, accountId: number): Observable<void> => this.httpClient.put<void>(`${apiUrl}/users/${userId}/account/${accountId}`, body, { withCredentials: true })
  }

  public readonly deposits = {
    get$: (userId: number): Observable<Deposit[]> => this.httpClient.get<Deposit[]>(`${apiUrl}/users/${userId}/deposit`, { withCredentials: true }),

    post$: (body: CreateDepositDto, userId: number): Observable<void> => this.httpClient.post<void>(`${apiUrl}/users/${userId}/deposit`, body, { withCredentials: true }),

    close$: (depositId: number, userId: number): Observable<void> => this.httpClient.post<void>(`${apiUrl}/users/${userId}/deposit/${depositId}/close`, { }, { withCredentials: true })
  }

  public readonly credits = {
    get$: (userId: number): Observable<Credit[]> => this.httpClient.get<Credit[]>(`${apiUrl}/users/${userId}/credit`, { withCredentials: true }),

    post$: (body: CreateCreditDto, userId: number): Observable<void> => this.httpClient.post<void>(`${apiUrl}/users/${userId}/credit`, body, { withCredentials: true }),

    pay$: (userId: number, creditId: number, body: MakePaymentRequest): Observable<void> => this.httpClient.post<void>(`${apiUrl}/users/${userId}/credit/${creditId}/pay`, body, { withCredentials: true }),

    getCreditInfo$: (creditId: number, userId: number): Observable<CreditPaymentInfoDto> => this.httpClient.get<CreditPaymentInfoDto>(`${apiUrl}/users/${userId}/credit/${creditId}`, { withCredentials: true })
  }
}
