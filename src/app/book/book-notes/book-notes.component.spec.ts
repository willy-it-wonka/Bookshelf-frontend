import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookNotesComponent } from './book-notes.component';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { of } from 'rxjs';
import { Book } from '../book';

describe('BookNotesComponent', () => {
  let component: BookNotesComponent;
  let fixture: ComponentFixture<BookNotesComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let activatedRouteMock: { snapshot: any };

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', ['getBookById']);
    bookService.getBookById.and.returnValue(of(new Book())); /* Always return Observable<Book>. 
    Solution for TypeError: Cannot read properties of undefined (reading 'subscribe').
    Helps avoid mocking with subscribe in each test method. */
    activatedRouteMock = { snapshot: { params: { id: 123 } } };

    await TestBed.configureTestingModule({
      imports: [BookNotesComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: BookService, useValue: bookService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component properly', () => {
    const idSpy = spyOn(component, 'initializeId');
    const bookSpy = spyOn(component, 'initializeBook');

    component.ngOnInit();

    expect(idSpy).toHaveBeenCalled();
    expect(bookSpy).toHaveBeenCalled();
  });

  it('should initialize id from the route parameters', () => {
    const bookId = 123;
    component.initializeId();
    expect(component.id).toEqual(bookId);
  });

  it('should call bookService.getBookById with the correct id from the id property', () => {
    component.initializeBook();
    expect(bookService.getBookById).toHaveBeenCalledWith(component.id);
  });

  it('should assign the fetched book to the book property', () => {
    const bookMock: Book = {
      id: 123,
      title: 'Title',
      author: 'Author',
      status: 'WAITING',
      createdDate: '2024-01-01',
      lastModifiedDate: '2024-01-01',
      linkToCover: 'http://example.com/cover.jpg',
    };
    bookService.getBookById.and.returnValue(of(bookMock));

    component.initializeBook();

    expect(component.book).toEqual(bookMock);
  });
});
