import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgotten-password',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  templateUrl: './forgotten-password.component.html',
  styleUrl: './forgotten-password.component.css',
})
export class ForgottenPasswordComponent {
  email: string = '';

  constructor(
    private readonly matDialogRef: MatDialogRef<ForgottenPasswordComponent>,
    private readonly userService: UserService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  onCancel(): void {
    this.matDialogRef.close();
  }

  initiateForgottenPasswordReset(): void {
    this.userService.initiateForgottenPasswordReset(this.email).subscribe({
      next: (response) => {
        this.matSnackBar.open(response, 'Close', { duration: 5000 });
        this.matDialogRef.close();
      },
      error: (error) => {
        this.matSnackBar.open(error.error, 'Close', { duration: 5000 });
      },
    });
  }
}
