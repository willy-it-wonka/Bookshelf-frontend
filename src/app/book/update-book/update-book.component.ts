import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../book';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookCategory } from '../book-category';

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-book.component.html',
  styleUrl: './update-book.component.css',
})
export class UpdateBookComponent implements OnInit {
  id!: number;
  book: Book = new Book();
  allCategories = Object.values(BookCategory); // Array of all values from BookCategory.
  selectedCategories = new Map<string, boolean>(); // For track the checked/unchecked status of category buttons.

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeId();
    this.initializeBook();
  }

  initializeId() {
    this.id = this.route.snapshot.params['id'];
  }

  initializeBook() {
    this.bookService.getBookById(this.id).subscribe({
      next: (data) => {
        this.book = data;
        this.getCurrentCategories();
      },
    });
  }

  // Prepare data to display current state of book.categories
  getCurrentCategories() {
    this.allCategories.forEach((category) => {
      this.selectedCategories.set(
        category,
        this.book.categories.includes(category)
      );
    });
  }

  // Change the state of selectedCategories when the category button is clicked.
  toggleCategory(category: string) {
    const isSelected = this.selectedCategories.get(category) || false;
    this.selectedCategories.set(category, !isSelected);
  }

  onSubmit() {
    this.setBookCategories();
    this.updateBook();
  }

  // Set book.categories based on selectedCategories (checked category buttons).
  setBookCategories() {
    this.book.categories = Array.from(this.selectedCategories.entries())
      .filter(([_, isSelected]) => isSelected) // Filtr by isSelected == true. Category is ignored _
      .map(([category]) => category as BookCategory); // Convert string to BookCategory.
  }

  updateBook() {
    this.bookService.updateBook(this.id, this.book).subscribe({
      next: (response) => console.log(response),
      complete: () => this.goToBookshelf(),
    });
  }

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ');
  }

  goToBookshelf() {
    this.router.navigate(['/bookshelf']);
  }
}
