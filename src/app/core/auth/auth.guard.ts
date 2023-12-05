import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";


const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (!token) router.navigateByUrl("auth");
  return !!token;
}

export default authGuard;
