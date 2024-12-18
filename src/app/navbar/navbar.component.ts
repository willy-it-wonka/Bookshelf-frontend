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
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly matSnackBar: MatSnackBar,
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
      const decodedPayload = JSON.parse(this.decodeUnicode(jwt.split('.')[1]));
      this.loggedInUserId = decodedPayload.sub;
      this.loggedInUsername = decodedPayload.nick;
    }
  }

  private decodeUnicode(payload: string) {
    return new TextDecoder().decode(
      Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))
    );
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

  openChangePasswordDialog(): void {
    this.matDialog.open(ChangeDetailsComponent, {
      data: { userId: this.loggedInUserId, changeType: 'password' },
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
