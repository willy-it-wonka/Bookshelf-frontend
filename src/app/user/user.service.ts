import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users';
  private headers: HttpHeaders;

  hasAuthToRoute: boolean = false;

  constructor(private httpClient: HttpClient) {
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

  // The next methods require authorization.

  checkEnabled(id: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/${id}/enabled`, {
      headers: this.headers,
    });
  }

  sendNewConfirmationEmail(id: string): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/${id}/new-confirmation-email`,
      {},
      { headers: this.headers, responseType: 'text' }
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
