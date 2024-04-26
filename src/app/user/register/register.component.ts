import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  user: User = new User();

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
}
