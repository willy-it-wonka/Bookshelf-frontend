import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetailsComponent } from '../user/change-details/change-details.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
  ],
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
    private matSnackBar: MatSnackBar,
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.checkLoggedIn();
    if (this.loggedIn) this.emailIsConfirmed();
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

  emailIsConfirmed() {
    this.userService
      .emailIsConfirmed(this.loggedInUserId)
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

  openChangeNickDialog(): void {
    const dialogRef = this.matDialog.open(ChangeDetailsComponent, {
      data: { userId: this.loggedInUserId, changeType: 'nick' }, // Data passed to the dialog.
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loggedInUsername = result; // Data received from the dialog, if successful.
    });
  }

  openChangeEmailDialog(): void {
    this.matDialog.open(ChangeDetailsComponent, {
      data: { userId: this.loggedInUserId, changeType: 'email' },
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
