import { Component } from '@angular/core';
import { UserService, User } from '../user.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  user: User = { name: '', email: '', password: '' };
  success = '';
  error = '';
  loading = false;

  constructor(private userService: UserService) {}

  submit() {
    this.loading = true;
    this.success = '';
    this.error = '';
    this.userService.createUser(this.user).subscribe({
      next: (res) => {
        this.success = 'User created!';
        this.user = { name: '', email: '', password: '' };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create user';
        this.loading = false;
      }
    });
  }
}
