import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBookComponent } from './create-book.component';
import { BookService } from '../book.service';
import { Book } from '../book';
import { of } from 'rxjs';
import { BookCategory } from '../book-category';

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

  it('should call setBookCategories(), saveBook(), resetForm(), showModal() when onSubmit() is called', () => {
    spyOn(component, 'setBookCategories');
    spyOn(component, 'saveBook');
    spyOn(component, 'resetForm');
    spyOn(component, 'showModal');

    component.onSubmit();

    expect(component.setBookCategories).toHaveBeenCalled();
    expect(component.saveBook).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should only add selected categories to the book', () => {
    component.selectedCategories.set('IT', true);
    component.selectedCategories.set('HORROR', false);
    component.selectedCategories.set('HISTORY', true);

    component.setBookCategories();

    expect(component.book.categories).toContain(BookCategory.IT);
    expect(component.book.categories).toContain(BookCategory.HISTORY);
    expect(component.book.categories).not.toContain(BookCategory.HORROR);
    expect(component.book.categories.length).toBe(2);
  });

  it('should call bookService.createBook with the book data from the client when saveBook() is called', () => {
    const spy = bookService.createBook.and.returnValue(of(new Book()));
    component.saveBook();
    expect(spy).toHaveBeenCalledWith(component.book);
  });

  it('should log response when successful saveBook()', () => {
    const response = new Book() ;
    bookService.createBook.and.returnValue(of(response));
    spyOn(console, 'log');

    component.saveBook();

    expect(console.log).toHaveBeenCalledWith(response);
  });

  it('should reset book properties and call resetCategories() when resetForm() is called', () => {
    component.book.title = 'title';
    component.book.author = 'author';
    component.book.status = 'READ';
    component.book.linkToCover = 'link';
    spyOn(component, 'resetCategories');

    component.resetForm();

    expect(component.book.title).toBe('');
    expect(component.book.author).toBe('');
    expect(component.book.status).toBe('');
    expect(component.book.linkToCover).toBe('');
    expect(component.resetCategories).toHaveBeenCalled();
  });

  it('should reset all categories to unselected', () => {
    // Set some categories to true to simulate user interaction.
    component.selectedCategories.set('IT', true);
    component.selectedCategories.set('HORROR', true);

    component.resetCategories();

    component.allCategories.forEach((category) => {
      expect(component.selectedCategories.get(category)).toBeFalse();
    });
  });

  it('should replace all underscores in category names with spaces', () => {
    const formattedCategory = component.formatCategory(BookCategory.SCIENCE_FICTION);
    expect(formattedCategory).toBe('SCIENCE FICTION');
  });

  it('should handle category names without underscores correctly', () => {
    const formattedCategory = component.formatCategory(BookCategory.BIOLOGY);
    expect(formattedCategory).toBe('BIOLOGY');
  });
});
