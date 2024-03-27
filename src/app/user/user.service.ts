import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api';

  // User's nick is saved when logging in.
  username: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private httpClient: HttpClient) {}

  /*HTTP POST to register a new user.*/
  createUser(user: User): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, user);
  }
}
