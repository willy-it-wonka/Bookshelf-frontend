import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { routesGuard } from './routes.guard';
import { UserService } from './user/user.service';

describe('routesGuard', () => {
  let userService: any;
  let router: any;
  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {} as any;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => routesGuard(...guardParameters));

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['getHasAuthToRoute']);
    router = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow the route if user is logged in', () => {
    userService.getHasAuthToRoute.and.returnValue(true);
    const result = executeGuard(route, state);
    expect(result).toBe(true);
  });

  it('should redirect to login if user is not logged in', () => {
    userService.getHasAuthToRoute.and.returnValue(false);
    const urlTree = {} as UrlTree;
    router.createUrlTree.and.returnValue(urlTree);

    const result = executeGuard(route, state);

    expect(result).toEqual(urlTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
