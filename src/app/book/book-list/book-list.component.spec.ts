import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookListComponent } from './book-list.component';
import { BookService } from '../book.service';
import { of } from 'rxjs';
import { Book } from '../book';
import { Router } from '@angular/router';
import { BookCategory } from '../book-category';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let router: jasmine.SpyObj<Router>;
  const bookId = 123;
  const booksMock: Book[] = [
    {
      id: 1,
      title: 'Title1',
      author: 'Author1',
      status: 'WAITING',
      linkToCover: 'http://example.com/cover.jpg',
      categories: [BookCategory.IT],
      createdDate: '2024-01-01',
      lastModifiedDate: '2024-01-02',
    },
    {
      id: 2,
      title: 'Title2',
      author: 'Author2',
      status: 'READ',
      linkToCover: 'http://example.com/cover.jpg',
      categories: [BookCategory.IT],
      createdDate: '2024-01-01',
      lastModifiedDate: '2024-01-01',
    },
  ];

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', [
      'getBookList',
      'deleteBook',
      'getBooksByStatus',
    ]);
    bookService.getBookList.and.returnValue(of([]));
    bookService.deleteBook.and.returnValue(of(undefined));
    bookService.getBooksByStatus.and.returnValue(of([]));
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BookListComponent],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component properly', () => {
    spyOn(component, 'getBooks');
    component.ngOnInit();
    expect(component.getBooks).toHaveBeenCalled();
  });

  it('should call bookService.getBookList', () => {
    component.getBooks();
    expect(bookService.getBookList).toHaveBeenCalled();
  });

  it('should assign the fetched list of books to the books property', () => {
    bookService.getBookList.and.returnValue(of(booksMock));
    component.getBooks();
    expect(component.books).toEqual(booksMock);
  });

  it('should navigate to the book notes page for a given book ID', () => {
    component.goToBookNotes(bookId);
    expect(router.navigate).toHaveBeenCalledWith(['/notes', bookId]);
  });

  it('should navigate to the update book page for a given book ID', () => {
    component.goToUpdateBook(bookId);
    expect(router.navigate).toHaveBeenCalledWith(['/update', bookId]);
  });

  it('should set selectedBookId to a given id and set showDeleteConfirmation to true', () => {
    component.openModalForDelete(bookId);
    expect(component.selectedBookId).toEqual(bookId);
    expect(component.showDeleteConfirmation).toBeTrue();
  });

  it('should delete the book', () => {
    component.selectedBookId = 123;

    component.confirmDelete();

    expect(bookService.deleteBook).toHaveBeenCalledWith(123);
    expect(bookService.getBookList).toHaveBeenCalled();
    expect(component.showDeleteConfirmation).toBeFalse();
    expect(component.selectedBookId).toBeNull();
  });

  it('should find books and reset pagination when searchTerms are provided', () => {
    component.books = booksMock;
    component.searchTerms = 'Title1';

    component.search();

    expect(component.page).toBe(1);
    expect(component.books.length).toBe(1);
  });

  it('should not find any books if searchTerms do not match any titles or authors', () => {
    component.books = booksMock;
    component.searchTerms = 'Jasmine';

    component.search();

    expect(component.books.length).toBe(0);
  });

  it('should get all books when no status is selected', () => {
    component.selectedStatus = '';
    component.filterByStatus();
    expect(bookService.getBookList).toHaveBeenCalled();
  });

  it('should get books by status when status is selected', () => {
    component.selectedStatus = 'READ';
    const filteredBooks = booksMock.filter((book) => book.status === 'READ');
    bookService.getBooksByStatus.and.returnValue(of(filteredBooks));

    component.filterByStatus();

    expect(bookService.getBooksByStatus).toHaveBeenCalledWith(component.selectedStatus);
    expect(component.books).toEqual(filteredBooks);
    expect(component.books.length).toBe(1);
  });

  it('should switch the sorting direction and sort by title', () => {
    component.books = booksMock;

    component.sortTableBy('title');
    expect(component.sortDirection).toEqual('asc');
    expect(component.books[0].title).toEqual('Title1');
    expect(component.books[1].title).toEqual('Title2');

    component.sortTableBy('title');
    expect(component.sortDirection).toEqual('desc');
    expect(component.books[0].title).toEqual('Title2');
    expect(component.books[1].title).toEqual('Title1');
  });

  it('should switch the sorting direction and sort by author', () => {
    component.books = booksMock;

    component.sortTableBy('author');
    expect(component.sortDirection).toEqual('asc');
    expect(component.books[0].author).toEqual('Author1');
    expect(component.books[1].author).toEqual('Author2');

    component.sortTableBy('author');
    expect(component.sortDirection).toEqual('desc');
    expect(component.books[0].author).toEqual('Author2');
    expect(component.books[1].author).toEqual('Author1');
  });
});
