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
  id!: number; // This is the book ID, also used in NoteService http requests.
  book!: Book;
  note!: Note;

  // For notes
  isEditing: boolean = false; // For switching between editing and presentation states.
  missingNotesMessage!: string; // For display info about lack of notes.
  canDelete: boolean = false; // For disable/enable the delete button.
  showDeleteConfirmation: boolean = false; // For delete modal.

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private noteService: NoteService
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
    this.bookService.getBookById(this.id).subscribe((response) => {
      this.book = response;
    });
  }

  initializeNote() {
    this.note = new Note();
    this.noteService.getNoteByBookId(this.id).subscribe({
      next: (response) => ((this.note = response), (this.canDelete = true)),
      error: (error) => (this.missingNotesMessage = error.error),
    });
  }

  saveNote() {
    if (this.note.id) {
      this.noteService.updateNote(this.id, this.note).subscribe({
        next: (response) => {
          console.log(response);
          this.isEditing = false;
        },
        error: (error) => console.log(error),
      });
    } else {
      this.note.book = this.book;
      this.noteService.createNote(this.note).subscribe({
        next: (response) => {
          console.log(response);
          this.isEditing = false;
          this.canDelete = true;
          this.cleanMissingNotesMessage();
        },
        error: (error) => console.log(error),
      });
    }
  }

  // To disable SAVE when there is no text or only whitespaces.
  canSaveNote(): boolean {
    if (this.note && this.note.content && this.note.content.trim().length > 0)
      return true;
    return false;
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
      this.noteService.deleteNoteByBookId(this.id).subscribe({
        next: () => {
          this.showDeleteConfirmation = false; // Hide the modal after confirming deletion.
          this.canDelete = false;
          this.initializeNote();
        },
      });
    }
  }
}
