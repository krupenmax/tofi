import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";


const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  router.navigateByUrl("login");
  return false;
}

export default authGuard;
