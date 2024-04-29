import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookListComponent } from './book/book-list/book-list.component';
import { CreateBookComponent } from './book/create-book/create-book.component';
import { UpdateBookComponent } from './book/update-book/update-book.component';
import { BookNotesComponent } from './book/book-notes/book-notes.component';
// Insted: import { HttpClientModule }; this: import provideHttpClient in app.config to avoid NullInjectorError.
import { RouterModule } from '@angular/router'; // Essential for properly functioning of nav bar.
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

  loggedIn: boolean = false;
  loggedInUserId!: string;
  loggedInUsername!: string;
  enabled!: boolean; // Is the email account confirmed?

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.loggedIn = true;
      console.log('loggedIn:', this.loggedIn);

      this.userService.setHasAuthToRoute(true);

      // JWT decoding.
      const decodedJwt = JSON.parse(atob(jwt.split('.')[1]));
      // Read data from JWT.
      this.loggedInUserId = decodedJwt.sub;
      this.loggedInUsername = decodedJwt.nick;
      console.log('UserId:', this.loggedInUserId);
      console.log('Username:', this.loggedInUsername);
    } else console.log('JWT not found in local storage.');

    if (this.loggedIn) this.checkEnabled();
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
      this.loggedIn = false;
      this.userService.setHasAuthToRoute(false);
      this.goToHomepage();
    });
  }

  goToHomepage() {
    this.router.navigate(['/homepage']);
  }
}
