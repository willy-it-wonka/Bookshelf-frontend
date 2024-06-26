import { Component } from '@angular/core';
import { Book } from '../book';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book.service';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-book.component.html',
  styleUrl: './create-book.component.css',
})
export class CreateBookComponent {
  book: Book = new Book();

  constructor(private bookService: BookService) {}

  onSubmit() {
    this.saveBook();
    this.resetForm();
    this.showModal();
  }

  saveBook() {
    this.bookService.createBook(this.book).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  resetForm() {
    this.book.title = '';
    this.book.author = '';
    this.book.linkToCover = '';
  }

  showModal() {
    const modalAfterAdd = document.getElementById('staticBackdrop');
    if (modalAfterAdd != null) modalAfterAdd.style.display = 'block';
  }
}
