import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user/user.service';
import { map, of } from 'rxjs';

export const routesGuard: CanActivateFn = () => {
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
