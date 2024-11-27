import { Routes } from '@angular/router';
import { BookListComponent } from './book/book-list/book-list.component';
import { CreateBookComponent } from './book/create-book/create-book.component';
import { UpdateBookComponent } from './book/update-book/update-book.component';
import { BookNotesComponent } from './book/book-notes/book-notes.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { routesGuard } from './routes.guard';
import { ContactComponent } from './contact/contact.component';
import { PasswordResetComponent } from './user/password-reset/password-reset.component';

export const routes: Routes = [
  { path: 'homepage', title: 'Home', component: HomepageComponent },
  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'bookshelf', title: 'Bookshelf', component: BookListComponent },
  { path: 'contact', title: 'Contact us', component: ContactComponent },
  { path: 'password-reset', title: 'Reset password', component: PasswordResetComponent },
  {
    path: 'create',
    title: 'Add book',
    component: CreateBookComponent,
    canActivate: [routesGuard],
  },
  {
    path: 'update/:id',
    title: 'Update book',
    component: UpdateBookComponent,
    canActivate: [routesGuard],
  },
  {
    path: 'notes/:id',
    title: 'Notes',
    component: BookNotesComponent,
    canActivate: [routesGuard],
  },
  { path: '**', redirectTo: 'homepage', pathMatch: 'full' },
];
