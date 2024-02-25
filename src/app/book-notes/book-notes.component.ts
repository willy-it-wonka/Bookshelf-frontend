import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-notes',
  standalone: true,
  imports: [],
  templateUrl: './book-notes.component.html',
  styleUrl: './book-notes.component.css',
})
export class BookNotesComponent implements OnInit {
  id!: number;
  book!: Book;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.book = new Book();
    this.bookService.getBookById(this.id).subscribe((data) => {
      this.book = data;
    });
  }
}
