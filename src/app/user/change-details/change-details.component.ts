import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-details',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './change-details.component.html',
  styleUrl: './change-details.component.css',
})
export class ChangeDetailsComponent {
  hidePassword: boolean = true;
  hideNewPassword: boolean = true;
  nick: string = '';
  email: string = '';
  password: string = '';
  newPassword: string = '';

  constructor(
    public dialogRef: MatDialogRef<ChangeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Data received from the NavBarComponent.
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  changeDetails(): void {
    const userId = this.data.userId;

    if (this.data.changeType === 'nick') this.changeNick(userId);
    else if (this.data.changeType === 'email') this.changeEmail(userId);
    else if (this.data.changeType === 'password') this.changePassword(userId);
  }

  private changeNick(userId: string): void {
    this.userService.changeNick(userId, this.nick, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('jwt', response.response);

        this.snackBar.open(
          'Your nick has been successfully changed.',
          'Close',
          {
            duration: 5000,
          }
        );

        this.dialogRef.close(this.nick); // Return changed nick to the NavBarComponent.
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 5000,
        });
      },
    });
  }

  private changeEmail(userId: string): void {
    this.userService.changeEmail(userId, this.email, this.password).subscribe({
      next: (response) => {
        this.snackBar.open(response.response, 'Close', {
          duration: 5000,
        });
        this.dialogRef.close();
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 5000,
        });
      },
    });
  }

  private changePassword(userId: string): void {
    this.userService
      .changePassword(userId, this.newPassword, this.password)
      .subscribe({
        next: (response) => {
          this.snackBar.open(response.response, 'Close', {
            duration: 5000,
          });
          this.dialogRef.close();
        },
        error: (error) => {
          this.snackBar.open(error.error, 'Close', {
            duration: 5000,
          });
        },
      });
  }
}
