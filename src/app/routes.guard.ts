import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
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
  console.log('userService.getHasAuthToRoute():', hasAuthToRoute);

  return of(hasAuthToRoute).pipe(
    map((loggedIn: boolean) => {
      if (loggedIn) return true;
      else return router.createUrlTree(['/login']);
    })
  );
};