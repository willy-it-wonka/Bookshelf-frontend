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
  missingNotesMessage!: string; // For display info about lack of notes.

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
      next: (response) => (this.note = response),
      error: (error) => (this.missingNotesMessage = error.error),
    });
  }
}
