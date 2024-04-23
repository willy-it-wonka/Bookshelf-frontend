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
  private userId: string;

  constructor(private httpClient: HttpClient) {
    this.headers = this.createAuthorizationHeader();
    this.userId = localStorage.getItem('userId') || "";
  }

  private createAuthorizationHeader() {
    const jwt = localStorage.getItem('jwt');
    let headers = new HttpHeaders();

    if (jwt) headers = headers.set('Authorization', 'Bearer ' + jwt);
    else console.log('JWT not found in local storage.');

    return headers;
  }

  /* The method retrieves a list of books from the database by making an HTTP GET request to a specified URL, 
  and returns the data as an object Observable<Book[]>. */
  getBookList(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.baseUrl}`, { headers: this.headers });
  }

  // HTTP POST to submit data from the "Add book" form.
  createBook(book: Book): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, book, { headers: this.headers });
  }

  // GET the data - to display it for "Edit".
  getBookById(id: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  updateBook(id: number, book: Book): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, book, { headers: this.headers });
  }

  deleteBook(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  // GET books by status.
  getBooksByStatus(status: string): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.baseUrl}/status/${status}`, { headers: this.headers });
  }
}
