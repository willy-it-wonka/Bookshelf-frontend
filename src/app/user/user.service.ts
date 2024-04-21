import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) {}

  /*HTTP POST to register a new user.*/
  createUser(user: User): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, user);
  }

  logout(): Observable<string> {
    return this.httpClient.get(`${this.baseUrl}/logout`, { responseType: 'text' });
  }

  checkEnabled(id: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/enabled/${id}`);
  }

  sendNewConfirmationEmail(id: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/new-conf-email/${id}`, {}, { responseType: 'text' });
  }
}
