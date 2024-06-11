import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgxCaptchaModule, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user: User = new User();

  /*
  Usage reCAPTCHA:
  1. Login to your goole account.
  2. Go to google.com/recaptcha/admin/create and configure it, click send, and you will get siteKey. */
  siteKey: string = 'YOUR_siteKey';
  isCaptchaResolved: boolean = false;

  constructor(
    private userService: UserService,
    private matSnackBar: MatSnackBar
  ) {}

  onSubmit() {
    console.log(this.user);
    this.saveUser();
  }

  saveUser() {
    this.userService.register(this.user).subscribe({
      next: (response) => {
        console.log(response),
          this.matSnackBar.open(
            'The confirmation email has been sent. Check your email.',
            'Close',
            {
              duration: 5000,
            }
          );
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
}
