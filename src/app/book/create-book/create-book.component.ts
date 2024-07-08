import { Component } from '@angular/core';
import { Book } from '../book';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService } from '../book.service';
import { BookCategory } from '../book-category';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-book.component.html',
  styleUrl: './create-book.component.css',
})
export class CreateBookComponent {
  book: Book = new Book();
  allCategories = Object.values(BookCategory); // Array of all values from BookCategory.
  selectedCategories = new Map<string, boolean>(); // For track the checked/unchecked status of category buttons.

  constructor(private bookService: BookService) {}

  // Change the state of selectedCategories when the category button is clicked.
  toggleCategory(category: string) {
    const isSelected = this.selectedCategories.get(category) || false;
    this.selectedCategories.set(category, !isSelected);
  }

  onSubmit() {
    this.setBookCategories();
    this.saveBook();
    this.resetForm();
    this.showModal();
  }

  setBookCategories() {
    this.book.categories = Array.from(this.selectedCategories.entries())
      .filter(([_, isSelected]) => isSelected) // Filtr by isSelected == true. Category is ignored _
      .map(([category]) => category as BookCategory); // Convert string to BookCategory.
  }

  saveBook() {
    this.bookService.createBook(this.book).subscribe((response) => {
      console.log(response);
    });
  }

  resetForm() {
    this.book.title = '';
    this.book.author = '';
    this.book.status = '';
    this.book.linkToCover = '';
    this.resetCategories();
  }

  resetCategories() {
    this.allCategories.forEach((category) => {
      this.selectedCategories.set(category, false);
    });
  }

  // Format category text by changing '_' to ' '
  formatCategory(category: string): string {
    return category.replace(/_/g, ' ');
  }

  showModal() {
    const modalAfterAdd = document.getElementById('staticBackdrop');
    if (modalAfterAdd != null) modalAfterAdd.style.display = 'block';
  }
}
