import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './navbar.component';
import { UserService } from '../user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NavbarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;
  const fakeJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmljayI6IkphbmVfRG9lIn0.s5pVXpGKsB_4W1EizmhD1Jy6Q7bRCVnrJw8kLpkHRDQ';

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', [
      'checkEnabled',
      'sendNewConfirmationEmail',
      'logout',
      'setHasAuthToRoute',
    ]);

    await TestBed.configureTestingModule({
      imports: [NavBarComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component properly', () => {
    spyOn(component, 'checkLoggedIn').and.callFake(() => (component.loggedIn = true));
    spyOn(component, 'checkEnabled');

    component.ngOnInit();

    expect(component.checkLoggedIn).toHaveBeenCalled();
    expect(component.checkEnabled).toHaveBeenCalled();
  });

  it('should set loggedIn and UserService.hasAuthToRoute to true and decode JWT if token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue(fakeJwt);
    spyOn(window, 'atob').and.returnValue('{"sub":"123", "nick":"Joe"}');

    component.checkLoggedIn();

    expect(component.loggedIn).toBeTrue();
    expect(userService.setHasAuthToRoute).toHaveBeenCalledWith(true);
    expect(component.loggedInUserId).toBe('123');
    expect(component.loggedInUsername).toBe('Joe');
  });

  it('should set enabled based on the response from userService.checkEnabled()', () => {
    const enabledMock = true;
    userService.checkEnabled.and.returnValue(of(enabledMock));
    component.loggedInUserId = '123';

    component.checkEnabled();

    expect(userService.checkEnabled).toHaveBeenCalledWith('123');
    expect(component.enabled).toBeTrue();
  });

  it('should call userService.sendNewConfirmationEmail() with the correct userId', () => {
    const responseMock = { message: 'New email sent.' };
    userService.sendNewConfirmationEmail.and.returnValue(of(responseMock));
    component.loggedInUserId = '123';

    component.sendNewConfirmationEmail();

    expect(userService.sendNewConfirmationEmail).toHaveBeenCalledWith('123');
  });

  it('should call userService.logout(), resetState(), goToHomepage()', () => {
    const responseMock = 'Logged out.';
    userService.logout.and.returnValue(of(responseMock));
    spyOn(component, 'resetState');
    spyOn(component, 'goToHomepage');

    component.logout();

    expect(userService.logout).toHaveBeenCalled();
    expect(component.resetState).toHaveBeenCalled();
    expect(component.goToHomepage).toHaveBeenCalled();
  });

  it('should clean JWT from localStorage, set loggedIn and UserService.hasAuthToRoute to false', () => {
    spyOn(localStorage, 'removeItem');

    component.resetState();

    expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
    expect(component.loggedIn).toBeFalse();
    expect(userService.setHasAuthToRoute).toHaveBeenCalledWith(false);
  });

  it('should navigate to homepage', () => {
    spyOn(router, 'navigate');
    component.goToHomepage();
    expect(router.navigate).toHaveBeenCalledWith(['/homepage']);
  });
});
