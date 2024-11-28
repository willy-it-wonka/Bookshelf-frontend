import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css',
})
export class PasswordResetComponent {
  confirmationToken: string = '';
  newPassword: string = '';
  hidePassword: boolean = true;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly userService: UserService,
    private readonly matSnackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.confirmationToken = params['token'];
    });
  }

  onSubmit() {
    this.resetForgottenPassword();
  }

  resetForgottenPassword(): void {
    this.userService
      .resetForgottenPassword(this.confirmationToken, this.newPassword)
      .subscribe({
        next: (response) => {
          this.matSnackBar.open(response, 'Close', { duration: 5000 });
          this.goToLogin();
        },
        error: (error) => {
          this.matSnackBar.open(error.error, 'Close', { duration: 5000 });
        },
      });
  }

  goToLogin() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
