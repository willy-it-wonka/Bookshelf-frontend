import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgxCaptchaModule, MatSnackBarModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user: User = new User();
  hidePassword: boolean = true;

  /*
  Usage reCAPTCHA:
  1. Login to your goole account.
  2. Go to google.com/recaptcha/admin/create and configure it, click send, and you will get siteKey. */
  siteKey: string = 'YOUR_siteKey';
  isCaptchaResolved: boolean = false;

  constructor(
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit() {
    console.log(this.user);
    this.saveUser();
  }

  saveUser() {
    this.userService.register(this.user).subscribe({
      next: (response) => {
        console.log(response);

        this.resetForm();

        this.matSnackBar.open(
          'The confirmation email has been sent. Check your email.',
          'Close',
          {
            duration: 4000,
          }
        );

        this.goToLogin();
      },
      error: (error) => {
        this.matSnackBar.open(error.error, 'Close', {
          duration: 5000,
        });
      },
    });
  }

  onCaptchaResolved(resolved: any) {
    this.isCaptchaResolved = true;
  }

  resetForm() {
    this.user.nick = '';
    this.user.email = '';
    this.user.password = '';
  }

  goToLogin() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
