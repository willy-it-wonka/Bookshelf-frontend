import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateBookComponent } from './update-book.component';
import { BookService } from '../book.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('UpdateBookComponent', () => {
  let component: UpdateBookComponent;
  let fixture: ComponentFixture<UpdateBookComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let activatedRouteMock: { snapshot: any };
  let router: Router;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', ['getBookById', 'updateBook']);
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

  it('should call updateBook() when onSubmit() is called', () => {
    spyOn(component, 'updateBook');
    component.onSubmit();
    expect(component.updateBook).toHaveBeenCalled();
  });

  it('should call bookService.updateBook with the correct data from the properties, and then go to bookshelf', () => {
    const spy = bookService.updateBook.and.returnValue(of(Book));
    spyOn(component, 'goToBookshelf');

    component.updateBook();

    expect(spy).toHaveBeenCalledWith(component.id, component.book);
    expect(component.goToBookshelf).toHaveBeenCalled();
  });

  it('should navigate to bookshelf', () => {
    spyOn(router, 'navigate');
    component.goToBookshelf();
    expect(router.navigate).toHaveBeenCalledWith(['/bookshelf']);
  });
});
