import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { JwtToken, Login, UserInfo } from '..';
import { tap, BehaviorSubject, Observable } from 'rxjs';
import { Router } from "@angular/router";
import { LOGIN_URL, TOKEN_KEY, USERINFO_KEY } from '../auth/constants';
import * as jwtDecoder from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	public readonly token$: Observable<string | undefined>;
  private readonly token$$: BehaviorSubject<string | undefined>;
  private readonly userInfo$$: BehaviorSubject<UserInfo | null>;
  private readonly userInfo$: Observable<UserInfo | null>;

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

  public handleLogout(): void {
		localStorage.removeItem(TOKEN_KEY);
		this.token$$.next(undefined);
	}

  public handleLogoutWithRedirect(): void {
		this.handleLogout();
		this.router.navigateByUrl(LOGIN_URL);
	}

	public login$(body: Login): Observable<JwtToken> {
		return this.backendService.auth.login$(body).pipe(
			tap(({ token }) => {
				this.setToken(token);
        const userInfo: UserInfo | null = this.decodeToken(token);
        this.setUserInfo(userInfo)
			})
		);
	}

  public setUserInfo(userInfo: UserInfo | null): void {
    this.userInfo$$.next(userInfo);
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
