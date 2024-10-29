import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user/user.service';

export const routesGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const hasAuthToRoute = userService.getHasAuthToRoute();

  if (hasAuthToRoute) return true;
  else return router.createUrlTree(['/login']);
};
