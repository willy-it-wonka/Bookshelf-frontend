import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from './note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private baseUrl = 'http://localhost:8080/api/notes';
  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.headers = this.createAuthorizationHeader();
  }

  private createAuthorizationHeader() {
    const jwt = localStorage.getItem('jwt');
    let headers = new HttpHeaders();

    if (jwt) this.headers = headers.set('Authorization', 'Bearer ' + jwt);
    else console.log('JWT not found in local storage.');

    return headers;
  }

  // Utility method to make HTTP requests with current headers.
  private makeHttpRequest<T>(
    method: string,
    url: string,
    body?: any
  ): Observable<T> {
    this.createAuthorizationHeader(); // Update headers before each request.
    return this.httpClient.request<T>(method, url, {
      headers: this.headers,
      body: body,
    });
  }

  getNoteByBookId(bookId: number): Observable<Note> {
    return this.makeHttpRequest<Note>('GET', `${this.baseUrl}/${bookId}`);
  }
}
