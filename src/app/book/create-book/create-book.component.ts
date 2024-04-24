import { Component, OnInit } from '@angular/core';
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
export class CreateBookComponent implements OnInit {
  book: Book = new Book();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.saveBook();

    // Clear text fields
    this.book.title = '';
    this.book.author = '';
    this.book.linkToCover = '';

    // Modal
    const modalAfterAdd = document.getElementById('staticBackdrop');
    if (modalAfterAdd != null) {
      modalAfterAdd.style.display = 'block';
    }
  }

  saveBook() {
    this.bookService.createBook(this.book).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }
}
