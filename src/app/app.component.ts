import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookListComponent } from './book/book-list/book-list.component';
import { CreateBookComponent } from './book/create-book/create-book.component';
import { UpdateBookComponent } from './book/update-book/update-book.component';
import { BookNotesComponent } from './book/book-notes/book-notes.component';
//insted: import { HttpClientModule } from '@angular/common/http'; this: import provideHttpClient in config to avoid NullInjectorError
import { RouterModule } from '@angular/router'; //Essential for properly functioning of nav menu.
import { CommonModule } from '@angular/common';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BookListComponent,
    CreateBookComponent,
    RouterModule,
    UpdateBookComponent,
    BookNotesComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'bookshelf-angular';

  loggedInUserId!: string;
  loggedInUsername!: string;
  enabled!: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const jwt = localStorage.getItem('jwt');
    // Check if JWT exists
    if (jwt) {
      // JWT decoding
      const decodedJwt = JSON.parse(atob(jwt.split('.')[1]));

      // Read data from JWT
      this.loggedInUsername = decodedJwt.nick;
      const userId = decodedJwt.sub;
      this.loggedInUserId = userId;
      localStorage.setItem('userId', userId); // For book.service

      console.log('User ID:', this.loggedInUserId);
      console.log('Nick:', this.loggedInUsername);
    } else {
      console.log('JWT not found in local storage.');
    }

    this.checkEnabled();
  }

  checkEnabled() {
    this.userService
      .checkEnabled(this.loggedInUserId)
      .subscribe((enabled: boolean) => {
        this.enabled = enabled;
      });
  }

  sendNewConfirmationEmail() {
    this.userService
      .sendNewConfirmationEmail(this.loggedInUserId)
      .subscribe((response: any) => {
        console.log(response);
      });
  }

  logout() {
    this.userService.logout().subscribe((response: any) => {
      console.log(response);
      localStorage.removeItem('jwt');
      localStorage.removeItem('userId');
      window.location.reload();
    });
  }
}
