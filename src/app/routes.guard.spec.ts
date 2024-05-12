import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { routesGuard } from './routes.guard';
import { UserService } from './user/user.service';
import { Observable, of } from 'rxjs';

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
    userService.getHasAuthToRoute.and.returnValue(of(true));
    
    const guardResult = TestBed.runInInjectionContext(
      () => routesGuard(route, state) as Observable<boolean | UrlTree>
    );

    guardResult.subscribe((result) => {
      expect(result).toBe(true);
    });
  });

  it('should redirect to login if user is not logged in', () => {
    userService.getHasAuthToRoute.and.returnValue(of(false));
    router.createUrlTree.and.returnValue(true);

    const guardResult = TestBed.runInInjectionContext(
      () => routesGuard(route, state) as Observable<boolean | UrlTree>
    );

    guardResult.subscribe((result) => {
      expect(result).toEqual(router.createUrlTree(['/login']));
    });
  });
});
