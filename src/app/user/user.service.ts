import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private registerUrl = 'http://localhost:8080/api/register';

  constructor(private httpClient: HttpClient) {}

  /*HTTP POST to register a new user.*/
  createUser(user: User): Observable<Object> {
    return this.httpClient.post(`${this.registerUrl}`, user);
  }
}
