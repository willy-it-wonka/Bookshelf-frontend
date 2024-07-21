import { TestBed } from '@angular/core/testing';
import { NoteService } from './note.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Note } from './note';
import { BookCategory } from './book-category';

describe('NoteService', () => {
  let service: NoteService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/v1/notes';
  const noteMock: Note = {
    id: 1,
    content: 'content',
    book: {
      id: 1,
      title: 'Title',
      author: 'Author',
      status: 'WAITING',
      linkToCover: 'http://example.com/cover',
      categories: [BookCategory.IT],
      createdDate: '2024-01-01',
      lastModifiedDate: '2024-01-02',
    },
  };
  const bookId = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NoteService],
    });
    service = TestBed.inject(NoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a note by bookId', () => {
    service.getNoteByBookId(bookId).subscribe((note) => {
      expect(note).toEqual(noteMock);
    });

    // Expect request with method 'GET' to the specified URL.
    const req = httpMock.expectOne(`${baseUrl}/${bookId}`);
    expect(req.request.method).toBe('GET');
    req.flush(noteMock); // Simulate a successful server response.
  });

  it('should send a POST request to create a new note', () => {
    service.createNote(noteMock).subscribe((response) => {
      expect(response).toEqual(noteMock);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(noteMock);
    req.flush(noteMock);
  });

  it('should send a PUT request to update an existing note', () => {
    service.updateNote(bookId, noteMock).subscribe((response) => {
      expect(response).toEqual(noteMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/${bookId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(noteMock);
    req.flush(noteMock);
  });

  it('should send a DELETE request to remove a note by bookId', () => {
    service.deleteNoteByBookId(bookId).subscribe((response) => {
      expect(response).toEqual('Note for this book does not exist.');
    });

    const req = httpMock.expectOne(`${baseUrl}/${bookId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Note for this book does not exist.');
  });
});
