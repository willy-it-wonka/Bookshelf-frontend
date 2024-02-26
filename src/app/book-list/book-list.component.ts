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
  selectedBookId: number | null = null;
  showDeleteConfirmation: boolean = false;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.getBooks();
  }

  private getBooks() {
    this.bookService.getBookList().subscribe((data) => {
      this.books = data;
    });
  }

  bookNotes(id: number) {
    this.router.navigate(['/notes', id]);
  }

  updateBook(id: number) {
    this.router.navigate(['/update', id]);
  }

  // Pop-up for delete button
  openModalForDelete(id: number) {
    this.selectedBookId = id;
    this.showDeleteConfirmation = true;
  }

  // Confirmation in a pop-up
  confirmDelete() {
    if (this.selectedBookId !== null) {
      this.bookService.deleteBook(this.selectedBookId).subscribe((data) => {
        console.log(data);
        this.getBooks();
      });
      this.showDeleteConfirmation = false; // Hide the pop-up after confirming deletion
      this.selectedBookId = null; // Reset selected book id
    }
  }
}
