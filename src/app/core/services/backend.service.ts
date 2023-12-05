import { Injectable } from '@angular/core';
import { JwtToken, Login, RegisterUserRequest } from '..';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const apiUrl = "api/api";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  public login$(body: Login): Observable<JwtToken> {
    return this.httpClient.post<JwtToken>(`${apiUrl}/auth/login`, body, { withCredentials: true });
  }

  public register$(body: RegisterUserRequest): Observable<void> {
    return this.httpClient.post<void>(`${apiUrl}/auth/register`, body, { withCredentials: true })
  }
}
