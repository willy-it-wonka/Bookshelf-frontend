import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly baseUrl = environment.bookApiBaseUrl;
  private readonly headers: HttpHeaders;

  // Used to return to the right page of the book list after editing.
  currentPage: number = 1;

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

  getAllUserBooks(): Observable<Book[]> {
    return this.makeHttpRequest<Book[]>('GET', `${this.baseUrl}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.makeHttpRequest('POST', `${this.baseUrl}`, book);
  }

  getUserBookById(id: number): Observable<Book> {
    return this.makeHttpRequest<Book>('GET', `${this.baseUrl}/${id}`);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.makeHttpRequest('PUT', `${this.baseUrl}/${id}`, book);
  }

  deleteBookById(id: number): Observable<void> {
    return this.makeHttpRequest('DELETE', `${this.baseUrl}/${id}`);
  }

  getUserBooksByStatus(status: string): Observable<Book[]> {
    return this.makeHttpRequest<Book[]>(
      'GET',
      `${this.baseUrl}/status?status=${status}`
    );
  }
}
