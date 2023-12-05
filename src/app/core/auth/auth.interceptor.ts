import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const token = authService.getToken();
	if (req.withCredentials && token) {
		req = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return next(req).pipe(
		catchError((err) => {
			if (err instanceof HttpErrorResponse && err.status === 401) {
				authService.handleLogoutWithRedirect();
			}
			return throwError(() => err);
		})
	);
};
