import { Routes } from '@angular/router';
import { BookListComponent } from './book/book-list/book-list.component';
import { CreateBookComponent } from './book/create-book/create-book.component';
import { UpdateBookComponent } from './book/update-book/update-book.component';
import { BookNotesComponent } from './book/book-notes/book-notes.component';

export const routes: Routes = [
  { path: 'bookshelf', component: BookListComponent },
  { path: 'create', component: CreateBookComponent },
  { path: 'update/:id', component: UpdateBookComponent },
  { path: 'notes/:id', component: BookNotesComponent },
  { path: '**', redirectTo: 'bookshelf', pathMatch: 'full' },
];
