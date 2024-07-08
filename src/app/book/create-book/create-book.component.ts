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

  constructor(private bookService: BookService) {}

  onSubmit() {
    this.saveBook();
    this.resetForm();
    this.showModal();
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
  }

  showModal() {
    const modalAfterAdd = document.getElementById('staticBackdrop');
    if (modalAfterAdd != null) modalAfterAdd.style.display = 'block';
  }
}
