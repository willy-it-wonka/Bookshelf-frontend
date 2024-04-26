import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookListComponent } from './book/book-list/book-list.component';
import { CreateBookComponent } from './book/create-book/create-book.component';
import { UpdateBookComponent } from './book/update-book/update-book.component';
import { BookNotesComponent } from './book/book-notes/book-notes.component';
//insted: import { HttpClientModule } from '@angular/common/http'; this: import provideHttpClient in config to avoid NullInjectorError
import { RouterModule } from '@angular/router'; //Essential for properly functioning of nav menu.
import { CommonModule } from '@angular/common';
import { UserService } from './user/user.service';
import { Router } from '@angular/router';

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
export class AppComponent implements OnInit {
  title = 'bookshelf-angular';

  loggedInUserId!: string;
  loggedInUsername!: string;
  enabled!: boolean; // Is the email account confirmed?
  loggedIn: boolean = false; // For nav bar.

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn();

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      // JWT decoding.
      const decodedJwt = JSON.parse(atob(jwt.split('.')[1]));

      // Read data from JWT.
      this.loggedInUserId = decodedJwt.sub;
      this.loggedInUsername = decodedJwt.nick;

      console.log('User ID:', this.loggedInUserId);
      console.log('Nick:', this.loggedInUsername);
    } else {
      console.log('JWT not found in local storage.');
    }

    if (this.loggedIn) this.checkEnabled();
  }

  isLoggedIn() {
    const loggedInValue = localStorage.getItem('loggedIn');
    if (loggedInValue) this.loggedIn = JSON.parse(loggedInValue);
    console.log(this.loggedIn);
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
      localStorage.removeItem('loggedIn');
      this.loggedIn = false;
      this.goToHomepage();
    });
  }

  goToHomepage() {
    this.router.navigate(['/homepage']);
  }
}
