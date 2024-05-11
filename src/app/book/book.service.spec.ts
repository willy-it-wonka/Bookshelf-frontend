import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Book } from './book';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/books';
  const booksMock: Book[] = [
    {
      id: 1,
      title: 'Title1',
      author: 'Author1',
      status: 'WAITING',
      createdDate: '2024-01-01',
      lastModifiedDate: '2024-01-02',
      linkToCover: 'http://example.com/cover.jpg',
    },
    {
      id: 2,
      title: 'Title2',
      author: 'Author2',
      status: 'READ',
      createdDate: '2024-01-01',
      lastModifiedDate: '2024-01-01',
      linkToCover: 'http://example.com/cover.jpg',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService],
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of the user books', () => {
    service.getBookList().subscribe((books) => {
      expect(books.length).toBe(2);
      expect(books).toEqual(booksMock);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(booksMock);
  });

  it('should return a book with the given id', () => {
    const id = booksMock[0].id;

    service.getBookById(id).subscribe((book) => {
      expect(book).toEqual(booksMock[0]);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(booksMock[0]);
  });

  it('should create a new book', () => {
    const newBook: Book = {
      id: 2,
      title: 'Title2',
      author: 'Author2',
      status: 'READ',
      createdDate: '2024-01-01',
      lastModifiedDate: '2024-01-01',
      linkToCover: 'http://example.com/cover.jpg',
    };
    const createdBook = booksMock[1];

    service.createBook(newBook).subscribe((book) => {
      expect(book).toEqual(createdBook);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBook);
    req.flush(createdBook);
  });

  it('should send an update request and return the updated book', () => {
    const updatedBook = { ...booksMock[0], title: 'Updated Title1' };

    service.updateBook(updatedBook.id, updatedBook).subscribe((book) => {
      expect(book).toEqual(updatedBook);
    });

    const req = httpMock.expectOne(`${baseUrl}/${updatedBook.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedBook);
    req.flush(updatedBook);
  });

  it('should send a delete request', () => {
    const id = 1;

    service.deleteBook(id).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get books by status and return an array of books', () => {
    const status = 'WAITING';
    const expectedBooks = booksMock.filter((book) => book.status === status);

    service.getBooksByStatus(status).subscribe((books) => {
      expect(books).toEqual(expectedBooks);
      expect(books.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/status/${status}`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedBooks);
  });
});
