import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  formGroup: FormGroup = this.formBuilder.group({
    from_email: '',
    from_name: '',
    subject: '',
    message: '',
  });

  constructor(private formBuilder: FormBuilder) {}

  /*
  Usage:
  1. Register at emailjs.com
  2. Go to Email Services. → Add New Service → and configure it. Now you have YOUR_SERVICE_ID.
  3. Go to Email Templates. → Create New Template → and configure it. Now you have YOUR_TEMPLATE_ID.
  4. Go to Account and get YOUR_PUBLIC_KEY.
  */

  async sendEmail() {
    emailjs.init('YOUR_PUBLIC_KEY');
    let response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      from_email: this.formGroup.value.from_email,
      from_name: this.formGroup.value.from_name,
      subject: this.formGroup.value.subject,
      message: this.formGroup.value.message,
    });

    this.formGroup.reset();
    alert('The email has been sent.');
  }
}
