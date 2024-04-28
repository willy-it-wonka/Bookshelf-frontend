import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgxCaptchaModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  user: User = new User();

  /*
  Usage reCAPTCHA:
  1. Login to your goole account.
  2. Go to google.com/recaptcha/admin/create and configure it, click send, and you will get siteKey. */
  siteKey: string = 'YOUR_siteKey';
  isCaptchaResolved: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.user);
    this.saveUser();
  }

  saveUser() {
    this.userService.register(this.user).subscribe({
      next: (response) => console.log(response),
      error: (error) => {
        console.log(error), alert(error.error);
      },
    });
  }

  onCaptchaResolved(resolved: any) {
    this.isCaptchaResolved = true;
  }
}
