import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgottenPasswordComponent } from './forgotten-password.component';
import { UserService } from '../user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

describe('ForgottenPasswordComponent', () => {
  let component: ForgottenPasswordComponent;
  let fixture: ComponentFixture<ForgottenPasswordComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ForgottenPasswordComponent>>;
  let matSnackBar: jasmine.SpyObj<MatSnackBar>;

  const email = 'test@email.com';

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    userService = jasmine.createSpyObj('UserService', [
      'initiateForgottenPasswordReset',
    ]);
    matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ForgottenPasswordComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: UserService, useValue: userService },
        { provide: MatSnackBar, useValue: matSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgottenPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the matDialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should call userService and show success message when password reset initiated successfully', () => {
    const response = 'Password reset email sent.';
    userService.initiateForgottenPasswordReset.and.returnValue(of(response));
    component.email = email;

    component.initiateForgottenPasswordReset();

    expect(userService.initiateForgottenPasswordReset).toHaveBeenCalledWith(email);
    expect(matSnackBar.open).toHaveBeenCalledWith(response, 'Close', { duration: 5000 });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error message when password reset initiation fails', () => {
    const error = { error: 'Error sending email.' };
    userService.initiateForgottenPasswordReset.and.returnValue(throwError(() => error));
    component.email = email;

    component.initiateForgottenPasswordReset();

    expect(userService.initiateForgottenPasswordReset).toHaveBeenCalledWith(email);
    expect(matSnackBar.open).toHaveBeenCalledWith(error.error, 'Close', { duration: 5000 });
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
