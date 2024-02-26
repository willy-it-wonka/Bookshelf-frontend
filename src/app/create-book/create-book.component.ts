import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { FormsModule } from '@angular/forms';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-book.component.html',
  styleUrl: './create-book.component.css',
})
export class CreateBookComponent implements OnInit {
  book: Book = new Book();

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.book);
    this.saveBook();
    //pop-up
    const addModel = document.getElementById('staticBackdrop');
    if (addModel != null) {
      addModel.style.display = 'block';
    }
  }

  saveBook() {
    this.bookService.createBook(this.book).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }
}
