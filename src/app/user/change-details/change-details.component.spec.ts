import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetailsComponent } from './change-details.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('ChangeDetailsComponent', () => {
  let component: ChangeDetailsComponent;
  let fixture: ComponentFixture<ChangeDetailsComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ChangeDetailsComponent>>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    userService = jasmine.createSpyObj('UserService', [
      'changeNick',
      'changeEmail',
      'changePassword',
    ]);

    await TestBed.configureTestingModule({
      imports: [ChangeDetailsComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { userId: '1' } },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call changeNick on UserService and close the dialog on success', () => {
    component.data.changeType = 'nick';
    const responseMock = { response: 'newJWT' };
    userService.changeNick.and.returnValue(of(responseMock));
    component.nick = 'newNick';
    component.password = '123';

    component.changeDetails();

    expect(userService.changeNick).toHaveBeenCalledWith('1', 'newNick', '123');
    expect(localStorage.getItem('jwt')).toBe(responseMock.response);
    expect(dialogRef.close).toHaveBeenCalledWith('newNick');
  });

  it('should show error message on changeNick failure', () => {
    component.data.changeType = 'nick';
    const errorResponse = { error: 'Incorrect password' };
    userService.changeNick.and.returnValue(throwError(() => errorResponse));
    component.nick = 'newNick';
    component.password = 'wrongPassword';

    component.changeDetails();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should call changeEmail on UserService and close the dialog on success', () => {
    component.data.changeType = 'email';
    const responseMock = { response: 'Email changed successfully.' };
    userService.changeEmail.and.returnValue(of(responseMock));
    component.email = 'newEmail@test.com';
    component.password = '123';

    component.changeDetails();

    expect(userService.changeEmail).toHaveBeenCalledWith(
      '1',
      'newEmail@test.com',
      '123'
    );
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error message on changeEmail failure', () => {
    component.data.changeType = 'email';
    const errorResponse = { error: 'Email already taken.' };
    userService.changeEmail.and.returnValue(throwError(() => errorResponse));
    component.email = 'existingEmail@test.com';
    component.password = '123';

    component.changeDetails();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should call changePassword on UserService and close the dialog on success', () => {
    component.data.changeType = 'password';
    const responseMock = { response: 'Password changed successfully.' };
    userService.changePassword.and.returnValue(of(responseMock));
    component.newPassword = 'newPass';
    component.password = 'currentPass';

    component.changeDetails();

    expect(userService.changePassword).toHaveBeenCalledWith(
      '1',
      'newPass',
      'currentPass'
    );
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should show error message on changePassword failure', () => {
    component.data.changeType = 'password';
    const errorResponse = { error: 'Incorrect current password.' };
    userService.changePassword.and.returnValue(throwError(() => errorResponse));
    component.newPassword = 'newPass';
    component.password = 'wrongPass';

    component.changeDetails();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
