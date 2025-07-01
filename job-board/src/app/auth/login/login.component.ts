import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;
  private auth = inject(AuthService);
  private activeModal = inject(NgbActiveModal, { optional: true });

  login() {
    this.loading = true;
    this.error = null;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        if (this.activeModal) this.activeModal.close();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed.';
      }
    });
  }
}
