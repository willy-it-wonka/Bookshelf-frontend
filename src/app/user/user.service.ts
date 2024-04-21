import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api';
  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.headers = this.createAuthorizationHeader();
  }

  private createAuthorizationHeader() {
    const jwt = localStorage.getItem('jwt');
    let headers = new HttpHeaders();

    if (jwt) headers = headers.set('Authorization', 'Bearer ' + jwt);
    else console.log('JWT not found in local storage.');

    return headers;
  }

  register(user: User): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, user);
  }

  logout(): Observable<string> {
    return this.httpClient.get(`${this.baseUrl}/logout`, {
      responseType: 'text',
    });
  }

  // Below methods require authorization.

  checkEnabled(id: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/enabled/${id}`, {
      headers: this.headers,
    });
  }

  sendNewConfirmationEmail(id: string): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/new-conf-email/${id}`,
      {},
      { headers: this.headers, responseType: 'text' }
    );
  }
}
