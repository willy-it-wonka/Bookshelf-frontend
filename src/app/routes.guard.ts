import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user/user.service';
import { map, of } from 'rxjs';

export const routesGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const hasAuthToRoute = userService.getHasAuthToRoute();

  return of(hasAuthToRoute).pipe(
    map((loggedIn: boolean) => {
      if (loggedIn) return true;
      else return router.createUrlTree(['/login']);
    })
  );
};
