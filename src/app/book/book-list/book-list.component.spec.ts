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
      'getAllUserBooks',
      'deleteBookById',
      'getUserBooksByStatus',
    ]);
    bookService.getAllUserBooks.and.returnValue(of([]));
    bookService.deleteBookById.and.returnValue(of(undefined));
    bookService.getUserBooksByStatus.and.returnValue(of([]));
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

  it('should call bookService.getAllUserBooks', () => {
    component.getBooks();
    expect(bookService.getAllUserBooks).toHaveBeenCalled();
  });

  it('should assign the fetched list of books to the properties', () => {
    bookService.getAllUserBooks.and.returnValue(of(booksMock));
    component.getBooks();
    expect(component.books).toEqual(booksMock);
    expect(component.allBooks).toEqual(booksMock);
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

    expect(bookService.deleteBookById).toHaveBeenCalledWith(123);
    expect(bookService.getAllUserBooks).toHaveBeenCalled();
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

  it('should toggle showCategoryButtons and reset book list when hiding categories', () => {
    component.showCategoryButtons = true;

    component.toggleCategories();

    expect(component.showCategoryButtons).toBeFalse();
    expect(component.books).toEqual(component.allBooks);
    expect(component.selectedCategories.size).toBe(0);
  });

  it('should toggle showCategoryButtons when showing categories', () => {
    component.showCategoryButtons = false;
    component.toggleCategories();
    expect(component.showCategoryButtons).toBeTrue();
  });

  it('should add category to selectedCategories if not already selected', () => {
    const category = BookCategory.IT;
    expect(component.selectedCategories.has(category)).toBeFalse();

    component.toggleCategory(category);

    expect(component.selectedCategories.has(category)).toBeTrue();
  });

  it('should remove category from selectedCategories if already selected', () => {
    const category = BookCategory.IT;
    component.selectedCategories.add(category);
    expect(component.selectedCategories.has(category)).toBeTrue();

    component.toggleCategory(category);

    expect(component.selectedCategories.has(category)).toBeFalse();
  });

  it('should call filterBookListByCategory when a category is toggled', () => {
    const category = BookCategory.IT;
    spyOn(component, 'filterBookListByCategory');

    component.toggleCategory(category);

    expect(component.filterBookListByCategory).toHaveBeenCalled();
  });

  it('should filter books by selected categories', () => {
    component.selectedCategories.add(BookCategory.IT);
    component.allBooks = booksMock;

    component.filterBookListByCategory();

    expect(component.books.length).toBe(2);
  });

  it('should reset books list when no categories are selected', () => {
    component.selectedCategories.clear();
    component.filterBookListByCategory();
    expect(component.books).toEqual(component.allBooks);
  });

  it('should reset to the first page when filter is applied', () => {
    component.page = 3;
    component.filterBookListByCategory();
    expect(component.page).toBe(1);
  });

  it('should get all books when no status is selected', () => {
    component.selectedStatus = '';
    component.filterBookListByStatus();
    expect(bookService.getAllUserBooks).toHaveBeenCalled();
  });

  it('should get books by status when status is selected', () => {
    component.selectedStatus = 'READ';
    const filteredBooks = booksMock.filter((book) => book.status === 'READ');
    bookService.getUserBooksByStatus.and.returnValue(of(filteredBooks));

    component.filterBookListByStatus();

    expect(bookService.getUserBooksByStatus).toHaveBeenCalledWith(component.selectedStatus);
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

  it('should replace all underscores in category names with spaces', () => {
    const formattedCategory = component.formatCategory(BookCategory.SELF_IMPROVEMENT);
    expect(formattedCategory).toBe('SELF IMPROVEMENT');
  });

  it('should handle category names without underscores correctly', () => {
    const formattedCategory = component.formatCategory(BookCategory.HISTORY);
    expect(formattedCategory).toBe('HISTORY');
  });
});
