import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { ConfirmOtpRequest, JwtToken, Login, UserInfo } from '..';
import { tap, BehaviorSubject, Observable } from 'rxjs';
import { Router } from "@angular/router";
import { EXPIRATION_KEY, LOGIN_URL, TOKEN_KEY, USERINFO_KEY } from '../auth/constants';
import * as jwtDecoder from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	public readonly token$: Observable<string | undefined>;
  private readonly token$$: BehaviorSubject<string | undefined>;
  private readonly userInfo$$: BehaviorSubject<UserInfo | null>;
  private readonly userInfo$: Observable<UserInfo | null>;
  private smsConfirmed = false;

  constructor(
    private readonly backendService: BackendService,
    private readonly router: Router
  ) {
    const token = localStorage.getItem(TOKEN_KEY) || undefined;
    const userInfo = null;
    this.userInfo$$ = new BehaviorSubject<UserInfo | null>(userInfo);
    this.userInfo$ = this.userInfo$$.asObservable();
		this.token$$ = new BehaviorSubject<string | undefined>(token);
		this.token$ = this.token$$.asObservable();

  }

  public getToken(): string | undefined {
		return this.token$$.value;
	}

  public getUserInfo(): UserInfo | null {
    return this.userInfo$$.value || this.decodeToken(this.getToken() || "");
  }

  public setToken(token: string): void {
		localStorage.setItem(TOKEN_KEY, token);
		this.token$$.next(token);
	}

  public setExpirationTime(value: string): void {
    localStorage.setItem(EXPIRATION_KEY, value);
  }

  public getExpirationTime(): string {
    return localStorage.getItem(EXPIRATION_KEY) || "";
  }

  public handleLogout(): void {
		localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERINFO_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
    this.userInfo$$.next(null);
		this.token$$.next(undefined);
	}

  public handleLogoutWithRedirect(): void {
		this.handleLogout();
		this.router.navigateByUrl(LOGIN_URL);
	}

	public login$(body: Login): Observable<JwtToken> {
		return this.backendService.auth.login$(body).pipe(
			tap(({ token, otpExpiration }) => {
				this.setToken(token);
        this.setExpirationTime(otpExpiration);
        const userInfo: UserInfo | null = this.decodeToken(token);
        this.setUserInfo(userInfo)
			})
		);
	}

  public refreshSMS$(): Observable<JwtToken> {
    return this.backendService.auth.refreshSMS$().pipe(
      tap(({ token, otpExpiration }) => {
				this.setToken(token);
        this.setExpirationTime(otpExpiration);
        const userInfo: UserInfo | null = this.decodeToken(token);
        this.setUserInfo(userInfo)
			})
    );
  }

  public confirmSMS$(body: ConfirmOtpRequest): Observable<void> {
    return this.backendService.auth.confirmSMS$(body);
  }

  public setSMSConfirmed(value: boolean): void {
    this.smsConfirmed = value;
  }

  public getSMSConfirmed(): boolean {
    return this.smsConfirmed;
  }

  public setUserInfo(userInfo: UserInfo | null): void {
    this.userInfo$$.next(userInfo);
  }

  public getDecodedToken(token: string): UserInfo | null {
    return this.getDecodedToken(token);
  }

  private decodeToken(token: string): UserInfo | null {
    try {
      return this.transformUserInfo(jwtDecoder.jwtDecode(token));
    } catch(Error) {
      return null;
    }
  }

  private transformUserInfo(value: any): UserInfo {
    return {
      userId: value.user_id,
      fullName: value.full_name,
      twoFactor: value.two_factor,
      iss: value.iss,
      sub: value.sub,
      email: value.email
    };
  }
}
