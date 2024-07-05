import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBookComponent } from './create-book.component';
import { BookService } from '../book.service';
import { Book } from '../book';
import { of } from 'rxjs';

describe('CreateBookComponent', () => {
  let component: CreateBookComponent;
  let fixture: ComponentFixture<CreateBookComponent>;
  let bookService: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', ['createBook']);

    await TestBed.configureTestingModule({
      imports: [CreateBookComponent],
      providers: [{ provide: BookService, useValue: bookService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call saveBook(), resetForm(), showModal() when onSubmit() is called', () => {
    spyOn(component, 'saveBook');
    spyOn(component, 'resetForm');
    spyOn(component, 'showModal');

    component.onSubmit();

    expect(component.saveBook).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should call bookService.createBook with the book data from the client when saveBook() is called', () => {
    const spy = bookService.createBook.and.returnValue(of(new Book()));
    component.saveBook();
    expect(spy).toHaveBeenCalledWith(component.book);
  });

  it('should log response when successful saveBook()', () => {
    const response = { Book };
    bookService.createBook.and.returnValue(of(response));
    spyOn(console, 'log');

    component.saveBook();

    expect(console.log).toHaveBeenCalledWith(response);
  });

  it('should reset book properties when resetForm() is called', () => {
    component.book.title = 'title';
    component.book.author = 'author';
    component.book.linkToCover = 'link';

    component.resetForm();

    expect(component.book.title).toBe('');
    expect(component.book.author).toBe('');
    expect(component.book.linkToCover).toBe('');
  });
});
