import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent {
  public auth = inject(AuthService);
  private http = inject(HttpClient);

  applications: any[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.error = 'You must be logged in to view your applications.';
      this.loading = false;
      return;
    }
    const token = this.auth.getToken();
    let userId: number | null = null;
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload['sub'] ? Number(payload['sub']) : null;
    }
    if (!userId) {
      this.error = 'Could not determine user ID.';
      this.loading = false;
      return;
    }
    this.http.get<any[]>(`http://localhost:5000/api/applications/user/${userId}`, {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` }
    }).subscribe({
      next: apps => {
        this.applications = apps;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.message || 'Failed to load applications.';
        this.loading = false;
      }
    });
  }
}
