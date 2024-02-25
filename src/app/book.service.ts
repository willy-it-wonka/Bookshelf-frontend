import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:8080/api/books';

  constructor(private httpClient: HttpClient) {}

  /*The method retrieves a list of books from the database by making an HTTP GET request to a specified URL, 
  and returns the data as an object Observable<Book[]>.*/
  getBookList(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.baseUrl}`);
  }

  /*HTTP POST to submit data from the "Add book" form.*/
  createBook(book: Book): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, book);
  }

  /*GET the data - to display it for editing.*/
  getBookById(id: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.baseUrl}/${id}`);
  }

  updateBook(id: number, book: Book): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
