import { Injectable } from '@angular/core';
import { Account, CreateAccountDto, JwtToken, Login, RegisterUserRequest } from '..';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const apiUrl = "api/api";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  public readonly auth = {
    login$: (body: Login): Observable<JwtToken> => this.httpClient.post<JwtToken>(`${apiUrl}/auth/login`, body, { withCredentials: true }),

    register$: (body: RegisterUserRequest): Observable<void> => this.httpClient.post<void>(`${apiUrl}/auth/register`, body, { withCredentials: true })
  }

  public readonly accounts = {
    get$: (userId: number): Observable<Account[]> => this.httpClient.get<Account[]>(`${apiUrl}/users/${userId}/accounts`, { withCredentials: true }),

    post$: (body: CreateAccountDto, userId: number): Observable<void> => this.httpClient.post<void>(`${apiUrl}/users/${userId}/accounts`, body, { withCredentials: true }),
  }
}
