import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from './user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/v1/users';
  const user: User = {
    nick: 'user',
    email: 'test@email.com',
    password: '123456',
  };
  const id = '1';
  const password = '123456';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post user data to register API and return user data', () => {
    service.register(user).subscribe((response) => {
      expect(response).toEqual(user);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('POST');
    req.flush(user);
  });

  it('should post credentials to login API and return token', () => {
    const responseMock = { token: '12345', status: true };

    service.login(user).subscribe((res) => {
      expect(res).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/session`);
    expect(req.request.method).toBe('POST');
    req.flush(responseMock);
  });

  it('should call logout API and return a success message', () => {
    const responseMock = 'Logged out.';

    service.logout().subscribe((res) => {
      expect(res).toBe(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/session`);
    expect(req.request.method).toBe('DELETE');
    req.flush(responseMock);
  });

  it('should ask about user status (enabled) and return it', () => {
    const responseMock = false;

    service.emailIsConfirmed(id).subscribe((enabled) => {
      expect(responseMock).toBeFalse();
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}/enabled`);
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);
  });

  it('should send post request to trigger the sending a new confirmation email', () => {
    const responseMock = 'New email sent.';

    service.sendNewConfirmationEmail(id).subscribe((res) => {
      expect(res).toBe(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}/new-confirmation-email`);
    expect(req.request.method).toBe('POST');
    req.flush(responseMock);
  });

  it('should send patch request to change user nick', () => {
    const nick = 'newNick';
    const responseMock = { message: 'newJWT' };

    service.changeNick(id, nick, password).subscribe((res) => {
      expect(res).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}/nick`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ nick, password });
    req.flush(responseMock);
  });

  it('should send patch request to change user email', () => {
    const email = 'newEmail@test.com';
    const responseMock = {
      message: 'Your email has been successfully changed.',
    };

    service.changeEmail(id, email, password).subscribe((res) => {
      expect(res).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}/email`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ email, password });
    req.flush(responseMock);
  });

  it('should send patch request to change user password', () => {
    const newPassword = 'newPass';
    const currentPassword = 'currentPass';
    const responseMock = {
      message: 'Your password has been successfully changed.',
    };

    service
      .changePassword(id, newPassword, currentPassword)
      .subscribe((res) => {
        expect(res).toEqual(responseMock);
      });

    const req = httpMock.expectOne(`${baseUrl}/${id}/password`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ newPassword, currentPassword });
    req.flush(responseMock);
  });

  it('should send post request to initiate forgotten password reset', () => {
    const email = 'test@test.com';
    const responseMock = 'Password reset email sent.';

    service.initiateForgottenPasswordReset(email).subscribe((res) => {
      expect(res).toBe(responseMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/forgotten-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email });
    req.flush(responseMock);
  });

  it('should send patch request to reset forgotten password', () => {
    const confirmationToken = 'token';
    const newPassword = 'newPassword';
    const responseMock = 'Password successfully reset.';

    service
      .resetForgottenPassword(confirmationToken, newPassword)
      .subscribe((res) => {
        expect(res).toBe(responseMock);
      });

    const req = httpMock.expectOne(`${baseUrl}/password-reset`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ confirmationToken, newPassword });
    req.flush(responseMock);
  });
});
