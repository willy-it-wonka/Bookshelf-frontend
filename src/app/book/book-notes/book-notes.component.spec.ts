import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookNotesComponent } from './book-notes.component';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { NoteService } from '../note.service';
import { Book } from '../book';
import { Note } from '../note';
import { of, throwError } from 'rxjs';
import { BookCategory } from '../book-category';

describe('BookNotesComponent', () => {
  let component: BookNotesComponent;
  let fixture: ComponentFixture<BookNotesComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let noteService: jasmine.SpyObj<NoteService>;
  let activatedRouteMock: { snapshot: any };
  const bookId = 123;
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
  const noteMock: Note = {
    id: 1,
    content: 'text',
    book: bookMock,
  };

  beforeEach(async () => {
    bookService = jasmine.createSpyObj('BookService', ['getUserBookById']);
    noteService = jasmine.createSpyObj('NoteService', [
      'getNoteByBookId',
      'createNote',
      'updateNote',
      'deleteNoteByBookId',
    ]);
    /* Always return Observable<...>. 
       Solution for TypeError: Cannot read properties of undefined (reading 'subscribe').
       Helps avoid mocking with subscribe in each test method. */
    bookService.getUserBookById.and.returnValue(of(new Book()));
    noteService.getNoteByBookId.and.returnValue(of(new Note()));
    noteService.createNote.and.returnValue(of(new Note()));
    noteService.updateNote.and.returnValue(of(new Note()));
    noteService.deleteNoteByBookId.and.returnValue(of(undefined));

    activatedRouteMock = { snapshot: { params: { id: 123 } } };

    await TestBed.configureTestingModule({
      imports: [BookNotesComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: BookService, useValue: bookService },
        { provide: NoteService, useValue: noteService },
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
    const noteSpy = spyOn(component, 'initializeNote');

    component.ngOnInit();

    expect(idSpy).toHaveBeenCalled();
    expect(bookSpy).toHaveBeenCalled();
    expect(noteSpy).toHaveBeenCalled();
  });

  it('should initialize id from the route parameters', () => {
    component.initializeId();
    expect(component.id).toEqual(bookId);
  });

  it('should call bookService.getUserBookById with the correct id from the id property', () => {
    component.initializeBook();
    expect(bookService.getUserBookById).toHaveBeenCalledWith(component.id);
  });

  it('should assign the fetched book to the book property', () => {
    bookService.getUserBookById.and.returnValue(of(bookMock));
    component.initializeBook();
    expect(component.book).toEqual(bookMock);
  });

  it('should replace all underscores in category names with spaces', () => {
    const formattedCategory = component.formatCategory(BookCategory.SELF_IMPROVEMENT);
    expect(formattedCategory).toBe('SELF IMPROVEMENT');
  });

  it('should handle category names without underscores correctly', () => {
    const formattedCategory = component.formatCategory(BookCategory.HISTORY);
    expect(formattedCategory).toBe('HISTORY');
  });

  it('should initialize the note from the book ID and allow deletion', () => {
    noteService.getNoteByBookId.and.returnValue(of(noteMock));

    component.initializeNote();

    expect(noteService.getNoteByBookId).toHaveBeenCalledWith(123);
    expect(component.note).toEqual({ id: 1, content: 'text', book: bookMock });
    expect(component.canDelete).toBeTrue();
  });

  it('should set missingNotesMessage from error message when the note does not exist', () => {
    const errorResponse = { error: 'Note for this book does not exist.' };
    noteService.getNoteByBookId.and.returnValue(throwError(() => errorResponse));

    component.initializeNote();

    expect(noteService.getNoteByBookId).toHaveBeenCalledWith(bookId);
    expect(component.missingNotesMessage).toBe('Note for this book does not exist.');
  });

  it('should create a new note when note ID is not set', () => {
    const note = new Note(); // this.note.id undefined
    component.note = note;

    component.saveNote();

    expect(noteService.createNote).toHaveBeenCalledWith(note);
    expect(noteService.updateNote).not.toHaveBeenCalled();
  });

  it('should update the note when note ID is set', () => {
    component.note = noteMock;
    component.id = bookId;

    component.saveNote();

    expect(noteService.updateNote).toHaveBeenCalledWith(123, { id: 1, content: 'text', book: bookMock });
    expect(noteService.createNote).not.toHaveBeenCalled();
  });

  it('should call noteService.updateNote with the correct parameters', () => {
    noteService.updateNote.and.returnValue(of(noteMock));

    component.updateNote(bookId, noteMock);

    expect(noteService.updateNote).toHaveBeenCalledWith(123, { id: 1, content: 'text', book: bookMock });
    expect(component.isEditing).toBeFalse();
  });

  it('should call noteService.createNote and save new note', () => {
    noteService.createNote.and.returnValue(of(noteMock));
    component.book = bookMock;
    component.note = noteMock;

    component.createNote(noteMock);

    expect(noteService.createNote).toHaveBeenCalledWith(noteMock);
    expect(component.note).toEqual({ id: 1, content: 'text', book: bookMock });
    expect(component.isEditing).toBeFalse();
    expect(component.canDelete).toBeTrue();
  });

  it('should return false if note has no content', () => {
    component.note = new Note();
    expect(component.canSaveNote()).toBeFalse();
  });

  it('should return false if note content is empty', () => {
    component.note = new Note();
    component.note.content = '';
    expect(component.canSaveNote()).toBeFalse();
  });

  it('should return false if note content is only whitespace', () => {
    component.note = new Note();
    component.note.content = '   ';
    expect(component.canSaveNote()).toBeFalse();
  });

  it('should return true if note content exists', () => {
    component.note = new Note();
    component.note.content = ' Hello ';
    expect(component.canSaveNote()).toBeTrue();
  });

  it('should clear the missingNotesMessage', () => {
    component.missingNotesMessage = 'Note for this book does not exist.';
    component.cleanMissingNotesMessage();
    expect(component.missingNotesMessage).toBe('');
  });

  it('should set showDeleteConfirmation to true when openModalForDelete is called', () => {
    component.showDeleteConfirmation = false;
    component.openModalForDelete();
    expect(component.showDeleteConfirmation).toBeTrue();
  });

  it('should call noteService.deleteNoteByBookId if showDeleteConfirmation is true', () => {
    component.showDeleteConfirmation = true;
    component.id = bookId;
    spyOn(component, 'initializeNote');

    component.confirmDelete();

    expect(noteService.deleteNoteByBookId).toHaveBeenCalledWith(123);
    expect(component.showDeleteConfirmation).toBeFalse();
    expect(component.canDelete).toBeFalse();
    expect(component.initializeNote).toHaveBeenCalled();
  });
});
