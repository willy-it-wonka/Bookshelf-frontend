import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatSnackBarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavBarComponent implements OnInit {
  loggedIn: boolean = false;
  loggedInUserId!: string;
  loggedInUsername!: string;
  enabled!: boolean; // Is the email account confirmed?

  constructor(
    private userService: UserService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.checkLoggedIn();
    if (this.loggedIn) this.checkEnabled();
  }

  checkLoggedIn() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.loggedIn = true;
      this.userService.setHasAuthToRoute(true);

      // JWT decoding.
      const decodedJwt = JSON.parse(atob(jwt.split('.')[1]));
      // Read data from JWT.
      this.loggedInUserId = decodedJwt.sub;
      this.loggedInUsername = decodedJwt.nick;
    }
  }

  checkEnabled() {
    this.userService
      .checkEnabled(this.loggedInUserId)
      .subscribe((enabled: boolean) => {
        this.enabled = enabled;
      });
  }

  sendNewConfirmationEmail() {
    this.userService.sendNewConfirmationEmail(this.loggedInUserId).subscribe({
      next: (response) => {
        this.matSnackBar.open(response, 'Close', {
          duration: 5000,
        });
      },
      error: (error) => {
        this.matSnackBar.open(error.error, 'Close', {
          duration: 5000,
        });
      },
    });
  }

  logout() {
    this.userService.logout().subscribe((response: any) => {
      console.log(response);
      this.resetState();
      this.goToHomepage();
    });
  }

  resetState() {
    localStorage.removeItem('jwt');
    this.loggedIn = false;
    this.userService.setHasAuthToRoute(false);
  }

  goToHomepage() {
    this.router.navigate(['/homepage']);
  }
}
