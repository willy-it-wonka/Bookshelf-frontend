import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PasswordResetComponent } from './password-reset.component';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let matSnackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['resetForgottenPassword']);
    matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = { queryParams: of({ token: '123' })};

    await TestBed.configureTestingModule({
      imports: [PasswordResetComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UserService, useValue: userService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set confirmationToken on ngOnInit', () => {
    component.ngOnInit();
    expect(component.confirmationToken).toBe('123');
  });

  it('should call resetForgottenPassword() when onSubmit() is called', () => {
    spyOn(component, 'resetForgottenPassword');
    component.onSubmit();
    expect(component.resetForgottenPassword).toHaveBeenCalled();
  });

  it('should reset password and show success message', () => {
    const response = 'Password reset successful.';
    spyOn(component, 'goToLogin');
    userService.resetForgottenPassword.and.returnValue(of(response));
    component.confirmationToken = '123';
    component.newPassword = 'newPassword';

    component.resetForgottenPassword();

    expect(userService.resetForgottenPassword).toHaveBeenCalledWith('123', 'newPassword');
    expect(matSnackBar.open).toHaveBeenCalledWith(response, 'Close', { duration: 5000 });
    expect(component.goToLogin).toHaveBeenCalledWith();
  });

  it('should show error message on reset password failure', () => {
    const error = { error: 'Reset failed.' };
    userService.resetForgottenPassword.and.returnValue(throwError(() => error));
    component.confirmationToken = '123';
    component.newPassword = 'newPassword123';
    
    component.resetForgottenPassword();

    expect(userService.resetForgottenPassword).toHaveBeenCalledWith('123', 'newPassword123');
    expect(matSnackBar.open).toHaveBeenCalledWith(error.error, 'Close', { duration: 5000 });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login page', fakeAsync(() => {
    component.goToLogin();
    tick(5000);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
