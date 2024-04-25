import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    console.log(this.email);
    this.signIn();
  }

  signIn() {
    let data = {
      email: this.email,
      password: this.password,
    };

    this.userService.login(data).subscribe((response: any) => {
      console.log(response);
      if (response.status === true) {
        localStorage.setItem('jwt', response.message); // Save JWT in local storage.
        localStorage.setItem('loggedIn', response.status); // For navigation bar.
        this.router.navigate(['/bookshelf']).then(() => {
          window.location.reload();
        });
      } 
      else if (response.message == 'User not found.')
        alert('Incorrect email.');
      else if (response.message == 'Incorrect password.')
        alert('Incorrect password.');
    });
  }
}
