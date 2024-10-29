import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../book';
import { Note } from '../note';
import { BookService } from '../book.service';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-book-notes',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './book-notes.component.html',
  styleUrl: './book-notes.component.css',
})
export class BookNotesComponent implements OnInit {
  id!: number; // This is a book ID, also used in NoteService http requests.
  book!: Book;
  note!: Note;
  initialNote!: Note; // Initial state of the note for comparison (block submit button).

  // For notes
  isEditing: boolean = false; // For switching between editing and presentation states.
  missingNotesMessage!: string; // For display info about lack of notes.
  canDelete: boolean = false; // For disable/enable the delete button.
  showDeleteConfirmation: boolean = false; // For delete modal.

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookService: BookService,
    private readonly noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.initializeId();
    this.initializeBook();
    this.initializeNote();
  }

  initializeId() {
    this.id = this.route.snapshot.params['id'];
  }

  initializeBook() {
    this.book = new Book();
    this.bookService.getUserBookById(this.id).subscribe((response) => {
      this.book = response;
    });
  }

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ');
  }

  initializeNote() {
    this.note = new Note();
    this.noteService.getNoteByBookId(this.id).subscribe({
      next: (response) => {
        this.note = response;
        this.initialNote = JSON.parse(JSON.stringify(response)); // Deep copy.
        this.canDelete = true;
      },
      error: (error) => {
        this.missingNotesMessage = error.error;
      },
    });
  }

  saveNote() {
    if (this.note.id) this.updateNote(this.id, this.note);
    else this.createNote(this.note);
  }

  updateNote(id: number, note: Note) {
    this.noteService.updateNote(id, note).subscribe((response) => {
      console.log(response);
      this.isEditing = false;
      this.initialNote = JSON.parse(JSON.stringify(response)); // Update initial state after saving.
    });
  }

  createNote(note: Note) {
    this.note.book = this.book;
    this.noteService.createNote(note).subscribe((response) => {
      console.log(response);
      this.note = response; // Without this, when you create a new note and try to edit it without first reloading
      // the page, it will cause a SQLIntegrityConstraintViolationException (re-creates instead of editing).
      this.initialNote = JSON.parse(JSON.stringify(response)); // Update initial state after creation.
      this.isEditing = false;
      this.canDelete = true;
      this.cleanMissingNotesMessage();
    });
  }

  // To disable SAVE when there is no text or only whitespaces.
  canSaveNote(): boolean {
    return !!this.note?.content?.trim();
  }

  // Comparison of the current state of the note with the initial state.
  isNoteChanged(): boolean {
    return JSON.stringify(this.note) !== JSON.stringify(this.initialNote);
  }

  cleanMissingNotesMessage() {
    this.missingNotesMessage = '';
  }

  // Modal for delete button.
  openModalForDelete() {
    this.showDeleteConfirmation = true;
  }

  // Confirmation in a modal.
  confirmDelete() {
    if (this.showDeleteConfirmation) {
      this.noteService.deleteNoteByBookId(this.id).subscribe(() => {
        this.showDeleteConfirmation = false; // Hide the modal after confirming deletion.
        this.canDelete = false;
        this.initializeNote();
      });
    }
  }
}
