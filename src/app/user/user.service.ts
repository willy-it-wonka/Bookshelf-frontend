import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = environment.userApiBaseUrl;
  private readonly headers: HttpHeaders;

  hasAuthToRoute: boolean = false; // For routesGuard

  constructor(private readonly httpClient: HttpClient) {
    this.headers = this.createAuthorizationHeader();
  }

  private createAuthorizationHeader() {
    const jwt = localStorage.getItem('jwt');
    let headers = new HttpHeaders();

    if (jwt) headers = headers.set('Authorization', 'Bearer ' + jwt);

    return headers;
  }

  register(user: User): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, user);
  }

  login(user: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/session`, user);
  }

  logout(): Observable<string> {
    return this.httpClient.delete(`${this.baseUrl}/session`, {
      responseType: 'text',
    });
  }

  initiateForgottenPasswordReset(email: string): Observable<string> {
    return this.httpClient.post(
      `${this.baseUrl}/forgotten-password`,
      { email },
      { responseType: 'text' }
    );
  }

  resetForgottenPassword(
    confirmationToken: string,
    newPassword: string
  ): Observable<string> {
    return this.httpClient.patch(
      `${this.baseUrl}/password-reset`,
      { confirmationToken, newPassword },
      { responseType: 'text' }
    );
  }

  // The next methods require authorization.

  emailIsConfirmed(id: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/${id}/enabled`, {
      headers: this.headers,
    });
  }

  sendNewConfirmationEmail(id: string): Observable<string> {
    return this.httpClient.post(
      `${this.baseUrl}/${id}/new-confirmation-email`,
      null,
      { headers: this.headers, responseType: 'text' }
    );
  }

  changeNick(id: string, nick: string, password: string): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/${id}/nick`,
      { nick, password },
      { headers: this.headers }
    );
  }

  changeEmail(id: string, email: string, password: string): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/${id}/email`,
      { email, password },
      { headers: this.headers }
    );
  }

  changePassword(
    id: string,
    newPassword: string,
    currentPassword: string
  ): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/${id}/password`,
      { newPassword, currentPassword },
      { headers: this.headers }
    );
  }

  // The next methods are for routesGuard.

  setHasAuthToRoute(value: boolean) {
    this.hasAuthToRoute = value;
  }

  getHasAuthToRoute(): boolean {
    return this.hasAuthToRoute;
  }
}
