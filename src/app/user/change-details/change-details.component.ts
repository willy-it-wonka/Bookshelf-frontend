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
  nick: string = '';
  password: string = '';

  constructor(
    public dialogRef: MatDialogRef<ChangeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Data received from the NavBarComponent.
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  changeNick(): void {
    const userId = this.data.userId;

    this.userService.changeNick(userId, this.nick, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('jwt', response.response);

        this.snackBar.open('Your nick was successfully changed.', 'Close', {
          duration: 5000,
        });

        this.dialogRef.close(this.nick); // Return changed nick to the NavBarComponent.
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Close', {
          duration: 5000,
        });
      },
    });
  }
}
