import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../book';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-book.component.html',
  styleUrl: './update-book.component.css',
})
export class UpdateBookComponent implements OnInit {
  id!: number;
  book: Book = new Book();

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
      next: (data) => (this.book = data),
      error: (error) => console.log(error),
    });
  }

  onSubmit() {
    this.updateBook();
  }

  updateBook() {
    this.bookService.updateBook(this.id, this.book).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
      complete: () => this.goToBookshelf(),
    });
  }

  goToBookshelf() {
    this.router.navigate(['/bookshelf']);
  }
}
