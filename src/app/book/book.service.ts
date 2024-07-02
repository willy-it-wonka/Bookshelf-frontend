import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:8080/api/books';
  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.headers = this.createAuthorizationHeader();
  }

  private createAuthorizationHeader() {
    const jwt = localStorage.getItem('jwt');
    let headers = new HttpHeaders();

    if (jwt) this.headers = headers.set('Authorization', 'Bearer ' + jwt);

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

  /* The method retrieves a list of books from the database by making an HTTP GET request to a specified URL, 
  and returns the data as an object Observable<Book[]>. */
  getBookList(): Observable<Book[]> {
    return this.makeHttpRequest<Book[]>('GET', `${this.baseUrl}`);
  }

  // HTTP POST to submit data from the "Add book" form.
  createBook(book: Book): Observable<Object> {
    return this.makeHttpRequest('POST', `${this.baseUrl}`, book);
  }

  getBookById(id: number): Observable<Book> {
    return this.makeHttpRequest<Book>('GET', `${this.baseUrl}/${id}`);
  }

  updateBook(id: number, book: Book): Observable<Object> {
    return this.makeHttpRequest('PUT', `${this.baseUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<Object> {
    return this.makeHttpRequest('DELETE', `${this.baseUrl}/${id}`);
  }

  getBooksByStatus(status: string): Observable<Book[]> {
    return this.makeHttpRequest<Book[]>('GET', `${this.baseUrl}/status/${status}`);
  }
  
}
