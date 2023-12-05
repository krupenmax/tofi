import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { JwtToken, Login } from '..';
import { tap, BehaviorSubject, Observable, switchMap, of } from 'rxjs';
import { Router } from "@angular/router";
import { LOGIN_URL, TOKEN_KEY } from '../auth/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	public readonly token$: Observable<string | undefined>;
  private readonly token$$: BehaviorSubject<string | undefined>;

  constructor(
    private readonly backendService: BackendService,
    private readonly router: Router
  ) {
    const token = localStorage.getItem(TOKEN_KEY) || undefined;
		this.token$$ = new BehaviorSubject<string | undefined>(token);
		this.token$ = this.token$$.asObservable();
  }

  public getToken(): string | undefined {
		return this.token$$.value;
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
		return this.backendService.login$(body).pipe(
			tap(({ token }) => {
				this.setToken(token);
			})
		);
	}
}
