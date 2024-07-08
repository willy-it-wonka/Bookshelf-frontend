import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateBookComponent } from './update-book.component';
import { BookService } from '../book.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BookCategory } from '../book-category';

describe('UpdateBookComponent', () => {
  let component: UpdateBookComponent;
  let fixture: ComponentFixture<UpdateBookComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let activatedRouteMock: { snapshot: any };
  let router: Router;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', [
      'getBookById',
      'updateBook',
    ]);
    bookService.getBookById.and.returnValue(of(new Book())); /* Always return Observable<Book>. 
    Solution for TypeError: Cannot read properties of undefined (reading 'subscribe').
    Helps avoid mocking with subscribe in each test method. */
    activatedRouteMock = { snapshot: { params: { id: 123 } } };

    await TestBed.configureTestingModule({
      imports: [UpdateBookComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: BookService, useValue: bookService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateBookComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component properly', () => {
    spyOn(component, 'initializeId');
    spyOn(component, 'initializeBook');

    component.ngOnInit();

    expect(component.initializeId).toHaveBeenCalled();
    expect(component.initializeBook).toHaveBeenCalled();
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

  it('should assign the fetched book to the book property and call getCurrentCategories()', () => {
    const bookMock: Book = {
      id: 123,
      title: 'Title',
      author: 'Author',
      status: 'WAITING',
      linkToCover: 'http://example.com/cover.jpg',
      categories: [BookCategory.IT],
      createdDate: '2024-01-01',
      lastModifiedDate: '2024-01-01',
    };
    bookService.getBookById.and.returnValue(of(bookMock));
    spyOn(component, 'getCurrentCategories');

    component.initializeBook();

    expect(component.book).toEqual(bookMock);
    expect(component.getCurrentCategories).toHaveBeenCalled();
  });

  it('should set selectedCategories map to reflect the current state of book categories', () => {
    component.book.categories = [BookCategory.IT];

    component.getCurrentCategories();

    expect(component.selectedCategories.get('IT')).toBeTrue();
    expect(component.selectedCategories.get('HISTORY')).toBeFalse();
  });

  it('should toggle category from false to true', () => {
    const category = 'IT';
    component.selectedCategories.set(category, false); // Set initial unchecked state.

    component.toggleCategory(category);

    expect(component.selectedCategories.get(category)).toBeTrue();
  });

  it('should toggle category from true to false', () => {
    const category = 'IT';
    component.selectedCategories.set(category, true); // Set initial checked state.

    component.toggleCategory(category);

    expect(component.selectedCategories.get(category)).toBeFalse();
  });

  it('should call setBookCategories() and updateBook() when onSubmit() is called', () => {
    spyOn(component, 'setBookCategories');
    spyOn(component, 'updateBook');

    component.onSubmit();

    expect(component.setBookCategories).toHaveBeenCalled();
    expect(component.updateBook).toHaveBeenCalled();
  });

  it('should only add selected categories to the book', () => {
    component.selectedCategories.set('IT', true);
    component.selectedCategories.set('DRAMA', false);
    component.selectedCategories.set('BUSINESS', true);

    component.setBookCategories();

    expect(component.book.categories).toContain(BookCategory.IT);
    expect(component.book.categories).toContain(BookCategory.BUSINESS);
    expect(component.book.categories).not.toContain(BookCategory.DRAMA);
    expect(component.book.categories.length).toBe(2);
  });

  it('should call bookService.updateBook with the correct data from the properties and call goToBookshelf()', () => {
    const spy = bookService.updateBook.and.returnValue(of(Book));
    spyOn(component, 'goToBookshelf');

    component.updateBook();

    expect(spy).toHaveBeenCalledWith(component.id, component.book);
    expect(component.goToBookshelf).toHaveBeenCalled();
  });

  it('should replace all underscores in category names with spaces', () => {
    const formattedCategory = component.formatCategory(BookCategory.SELF_IMPROVEMENT);
    expect(formattedCategory).toBe('SELF IMPROVEMENT');
  });

  it('should handle category names without underscores correctly', () => {
    const formattedCategory = component.formatCategory(BookCategory.HISTORY);
    expect(formattedCategory).toBe('HISTORY');
  });

  it('should navigate to bookshelf', () => {
    spyOn(router, 'navigate');
    component.goToBookshelf();
    expect(router.navigate).toHaveBeenCalledWith(['/bookshelf']);
  });
});
