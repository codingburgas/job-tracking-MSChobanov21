import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error: string | null = null;
  success: string | null = null;
  private auth = inject(AuthService);
  private activeModal = inject(NgbActiveModal, { optional: true });

  register() {
    this.loading = true;
    this.error = null;
    this.success = null;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful! You can now sign in.';
        if (this.activeModal) this.activeModal.close();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed.';
      }
    });
  }
}
