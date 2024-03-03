import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { CommonModule } from '@angular/common';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { NgxSearchFilterModule } from 'ngx-search-filter';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    NgxSearchFilterModule,
    FormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  // for Delete pop-up
  selectedBookId: number | null = null;
  showDeleteConfirmation: boolean = false;

  // for search()
  searchTerms: any;

  // to pagination
  page: number = 1;

  // for filterByStatus()
  selectedStatus: string = '';

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.getBooks();
  }

  private getBooks() {
    this.bookService.getBookList().subscribe((data) => {
      this.books = data;
    });
  }

  goToBookNotes(id: number) {
    this.router.navigate(['/notes', id]);
  }

  updateBook(id: number) {
    this.router.navigate(['/update', id]);
  }

  // Pop-up for delete button.
  openModalForDelete(id: number) {
    this.selectedBookId = id;
    this.showDeleteConfirmation = true;
  }

  // Confirmation in a pop-up.
  confirmDelete() {
    if (this.selectedBookId !== null) {
      this.bookService.deleteBook(this.selectedBookId).subscribe((data) => {
        console.log(data);
        this.getBooks();
      });
      this.showDeleteConfirmation = false; // Hide the pop-up after confirming deletion.
      this.selectedBookId = null; // Reset selected book id.
    }
  }

  // To the search bar. Checks whether the string you type is in a title and/or an author.
  search() {
    if (this.searchTerms == '') {
      this.ngOnInit();
    } else {
      this.books = this.books.filter((res) => {
        const titleMatch = res.title
          .toLocaleLowerCase()
          .includes(this.searchTerms.toLocaleLowerCase());
        const authorMatch = res.author
          .toLocaleLowerCase()
          .includes(this.searchTerms.toLocaleLowerCase());
        return titleMatch || authorMatch;
      });
    }
  }

  // Method to filter books based on selected status.
  filterByStatus() {
    if (this.selectedStatus) {
      this.bookService.getBooksByStatus(this.selectedStatus).subscribe({
        next: (data) => {
          this.books = data;
        },
      });
    } else {
      this.getBooks(); // If no status is selected, fetch all books.
    }
  }
}
