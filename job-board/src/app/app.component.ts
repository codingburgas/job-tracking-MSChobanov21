import { Component, computed, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'job-board';
  auth = inject(AuthService);

  user = signal<any | null>(null);
  isAuthenticated = computed(() => !!this.user());

  constructor() {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode JWT to get user info (simple base64 decode, not verified)
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user.set({
        name: payload['name'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User',
        email: payload['email'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        role: payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
      });
    } else {
      this.user.set(null);
    }
  }

  logout() {
    this.auth.logout();
    this.user.set(null);
    window.location.reload();
  }
}
