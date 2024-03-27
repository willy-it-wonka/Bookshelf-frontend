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

    this.userService.login(data).subscribe((result: any) => {
      console.log(result);
      if (result.message == 'Successfully logged in.')
        this.router.navigate(['/bookshelf']);
      else if (result.message == 'User not found.') 
        alert('Incorrect email.');
      else if (result.message == 'Incorrect password.')
        alert('Incorrect password.');
    });
  }
}
