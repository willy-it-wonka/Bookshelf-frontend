import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgxCaptchaModule, MatSnackBarModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  formGroup: FormGroup = this.formBuilder.group({
    from_email: ['', [Validators.required, Validators.email]],
    from_name: ['', Validators.required],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  readonly siteKey: string = environment.reCaptchaSiteKey;
  isCaptchaResolved: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly matSnackBar: MatSnackBar
  ) {}

  async sendEmail() {
    emailjs.init(environment.emailJsPublicKey);
    let response = await emailjs.send(
      environment.emailJsServiceId,
      environment.emailjJsTemplateId,
      {
        from_email: this.formGroup.value.from_email,
        from_name: this.formGroup.value.from_name,
        subject: this.formGroup.value.subject,
        message: this.formGroup.value.message,
      }
    );

    this.formGroup.reset();
    this.matSnackBar.open('The email has been sent.', 'Close', {
      duration: 5000,
    });
  }

  onCaptchaResolved(resolved: any) {
    this.isCaptchaResolved = true;
  }
}
