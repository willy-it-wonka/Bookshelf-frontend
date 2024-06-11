import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UserService } from '../user.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, NoopAnimationsModule],
      providers: [{ provide: UserService, useValue: userService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    setTimeout(function () {    // Solution for "Error: reCAPTCHA placeholder element must be an element or id" which
      fixture.detectChanges();  // appears in random unit tests.
    }, 2000);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call saveUser() when onSubmit() is called', () => {
    spyOn(component, 'saveUser'); // Mocking saveUser().
    component.onSubmit();
    expect(component.saveUser).toHaveBeenCalled();
  });

  it('should call userService.register with the correct user data', () => {
    const response = {};
    userService.register.and.returnValue(of(response)); // Mocking register() from UserService.

    component.saveUser();

    expect(userService.register).toHaveBeenCalledWith(component.user);
  });

  it('should call userService.register with invalid user data', () => {
    const errorResponse = { error: 'Registration failed.' };
    userService.register.and.returnValue(throwError(() => errorResponse));

    component.saveUser();

    expect(userService.register).toHaveBeenCalledWith(component.user);
  });

  it('should set isCaptchaResolved to true when captcha is resolved', () => {
    const resolvedValue = true;
    component.onCaptchaResolved(resolvedValue);
    expect(component.isCaptchaResolved).toBeTruthy();
  });
});
