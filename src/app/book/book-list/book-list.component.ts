import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { CommonModule } from '@angular/common';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { NgxSearchFilterModule } from 'ngx-search-filter';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { BookCategory } from '../book-category';

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
  allBooks: Book[] = [];

  // For delete modal
  selectedBookId: number | null = null;
  showDeleteConfirmation: boolean = false;

  // For search()
  searchTerms: any;

  // For pagination
  page: number = 1;

  // For filterByStatus()
  selectedStatus: string = '';

  // For sortTableBy()
  sortDirection: 'asc' | 'desc' | '' = '';
  field: string = '';

  // For category filtering
  allCategories: BookCategory[] = Object.values(BookCategory);
  selectedCategories: Set<BookCategory> = new Set();
  showCategoryButtons: boolean = false;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.bookService.getBookList().subscribe((response) => {
      this.allBooks = response;
      this.books = response;
    });
  }

  goToBookNotes(id: number) {
    this.router.navigate(['/notes', id]);
  }

  goToUpdateBook(id: number) {
    this.router.navigate(['/update', id]);
  }

  // Modal for delete button.
  openModalForDelete(id: number) {
    this.selectedBookId = id;
    this.showDeleteConfirmation = true;
  }

  // Confirmation in a modal.
  confirmDelete() {
    if (this.selectedBookId !== null) {
      this.bookService.deleteBook(this.selectedBookId).subscribe(() => {
        this.getBooks();
      });
      this.showDeleteConfirmation = false; // Hide the modal after confirming deletion.
      this.selectedBookId = null; // Reset selected book id.
    }
  }

  // For the search bar. Checks if the typed string is in a title and/or an author.
  search() {
    this.page = 1; // After searching, go to page 1. Without this, you may think that the search doesn't work on page 2 and next.
    if (this.searchTerms == '') {
      if (this.selectedCategories.size > 0) this.filterBooksByCategory();
      else this.books = this.allBooks; // Reset to the original book list.
    } else {
      this.books = this.books.filter((book) => {
        const titleMatch = book.title
          .toLocaleLowerCase()
          .includes(this.searchTerms.toLocaleLowerCase());
        const authorMatch = book.author
          .toLocaleLowerCase()
          .includes(this.searchTerms.toLocaleLowerCase());
        return titleMatch || authorMatch;
      });
    }
  }

  // Show/hide list of categories.
  toggleCategories() {
    // Reset to the original state when opening categories.
    this.searchTerms = '';
    this.books = this.allBooks;

    this.showCategoryButtons = !this.showCategoryButtons;
    if (!this.showCategoryButtons) {
      this.selectedCategories.clear();
      this.books = this.allBooks; // Reset to the original book list when hiding categories.
    }
  }

  // Check/uncheck the category button.
  toggleCategory(category: BookCategory) {
    this.searchTerms = '';

    if (this.selectedCategories.has(category))
      this.selectedCategories.delete(category);
    else this.selectedCategories.add(category);

    this.filterBooksByCategory(); // Filter at each check/uncheck.
  }

  filterBooksByCategory() {
    if (this.selectedCategories.size > 0) {
      this.books = this.allBooks.filter((book) =>
        // Filter the list of books by every checked category.
        Array.from(this.selectedCategories).every((category) =>
          book.categories.includes(category)
        )
      );
    } else this.books = this.allBooks; // If no category is selected, return all books.
  }

  // Filter books based on selected status.
  filterByStatus() {
    if (this.showCategoryButtons) this.toggleCategories(); // Hide and reset categories.
    if (this.selectedStatus) {
      this.bookService
        .getBooksByStatus(this.selectedStatus)
        .subscribe((response) => {
          this.books = response;
        });
    } else this.books = this.allBooks; // If no status is selected, return all books.
  }

  // Sort asc/desc by title/author.
  sortTableBy(field: string) {
    this.field = field;
    // Change the sorting direction when you click.
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.books.sort((a, b) => {
      let result: number = 0;
      if (field === 'title') result = a[field].localeCompare(b[field]);
      else if (field === 'author') result = a[field].localeCompare(b[field]);

      // Return the sorted result, taking into account the sorting direction.
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ');
  }
}
