import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { CommonModule } from '@angular/common';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.getBooks();
  }

  private getBooks() {
    this.bookService.getBookList().subscribe((data) => {
      this.books = data;
    });
  }

  updateBook(id: number) {
    this.router.navigate(['/update', id]);
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe((data) => {
      console.log(data);
      this.getBooks();
    });
  }

  bookNotes(id: number) {
    this.router.navigate(['/notes', id]);
  }
}
