import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from './note';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly baseUrl = environment.noteApiBaseUrl;
  private readonly headers: HttpHeaders;

  constructor(private readonly httpClient: HttpClient) {
    this.headers = this.createAuthorizationHeader();
  }

  private createAuthorizationHeader() {
    const jwt = localStorage.getItem('jwt');
    let headers = new HttpHeaders();

    if (jwt) headers = headers.set('Authorization', 'Bearer ' + jwt);

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

  createNote(note: Note): Observable<Note> {
    return this.makeHttpRequest<Note>('POST', `${this.baseUrl}`, note);
  }

  updateNote(bookId: number, note: Note): Observable<Note> {
    return this.makeHttpRequest<Note>('PUT', `${this.baseUrl}/${bookId}`, note);
  }

  deleteNoteByBookId(bookId: number): Observable<void> {
    return this.makeHttpRequest('DELETE', `${this.baseUrl}/${bookId}`);
  }
}
