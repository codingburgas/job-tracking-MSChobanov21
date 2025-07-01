import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  public auth = inject(AuthService);
  user: any = null;
  editing = false;
  newName = '';
  success: string | null = null;
  error: string | null = null;

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const token = this.auth.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user = {
        name: payload['name'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User',
        email: payload['email'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        role: payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
      };
      this.newName = this.user.name;
    }
  }

  startEdit() {
    this.editing = true;
    this.success = null;
    this.error = null;
    this.newName = this.user.name;
  }

  cancelEdit() {
    this.editing = false;
    this.newName = this.user.name;
  }

  save() {
    if (!this.newName.trim()) {
      this.error = 'Name cannot be empty.';
      return;
    }
    // For demo: update local user only (no backend support)
    this.user.name = this.newName;
    this.editing = false;
    this.success = 'Name updated locally.';
  }
}
