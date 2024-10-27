import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './navbar.component';
import { UserService } from '../user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NavbarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', [
      'emailIsConfirmed',
      'sendNewConfirmationEmail',
      'logout',
      'setHasAuthToRoute',
    ]);
    userService.emailIsConfirmed.and.returnValue(of(true)); // beforeEach because is called in ngOnInit

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
    spyOn(component, 'emailIsConfirmed');

    component.ngOnInit();

    expect(component.checkLoggedIn).toHaveBeenCalled();
    expect(component.emailIsConfirmed).toHaveBeenCalled();
  });

  it('should set loggedIn and UserService.hasAuthToRoute to true and decode JWT if token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmljayI6IkphbmVfRG9lIn0.s5pVXpGKsB_4W1EizmhD1Jy6Q7bRCVnrJw8kLpkHRDQ'
    );
    spyOn(window, 'atob').and.returnValue(
      '{"sub":"1234567890", "nick":"Jane_Doe"}'
    );

    component.checkLoggedIn();

    expect(component.loggedIn).toBeTrue();
    expect(userService.setHasAuthToRoute).toHaveBeenCalledWith(true);
    expect(component.loggedInUserId).toBe('1234567890');
    expect(component.loggedInUsername).toBe('Jane_Doe');
  });

  it('should set enabled based on the response from userService.emailIsConfirmed()', () => {
    component.loggedInUserId = '123';

    component.emailIsConfirmed();

    expect(userService.emailIsConfirmed).toHaveBeenCalledWith('123');
    expect(component.enabled).toBeTrue();
  });

  it('should call userService.sendNewConfirmationEmail() with the correct userId', () => {
    const responseMock = 'New email sent.';
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
