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

  onSubmit() {
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
        this.goToBookshelf();
      } else alert(response.message);
    });
  }

  goToBookshelf() {
    this.router.navigate(['/bookshelf']).then(() => {
      window.location.reload(); // Essential to change the guest navbar to the user navbar.
    });
  }
}
