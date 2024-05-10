import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UserService } from '../user.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [{ provide: UserService, useValue: userService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call saveUser() when onSubmit() is called', () => {
    spyOn(component, 'saveUser'); // Mocking saveUser().
    component.onSubmit();
    expect(component.saveUser).toHaveBeenCalled();
  });

  it('should call userService.register with the correct user data and show success alert', () => {
    const response = {};
    userService.register.and.returnValue(of(response)); // Mocking register() from UserService.
    spyOn(window, 'alert'); // Mocking alert().

    component.saveUser();

    expect(userService.register).toHaveBeenCalledWith(component.user);
    expect(window.alert).toHaveBeenCalledWith(
      'The confirmation email has been sent. Check your email.'
    );
  });

  it('should call userService.register with invalid user data and show error alert', () => {
    const errorResponse = { error: 'Registration failed.' };
    userService.register.and.returnValue(throwError(() => errorResponse));
    spyOn(window, 'alert');

    component.saveUser();

    expect(userService.register).toHaveBeenCalledWith(component.user);
    expect(window.alert).toHaveBeenCalledWith('Registration failed.');
  });

  it('should set isCaptchaResolved to true when captcha is resolved', () => {
    const resolvedValue = true;
    component.onCaptchaResolved(resolvedValue);
    expect(component.isCaptchaResolved).toBeTruthy();
  });
});
