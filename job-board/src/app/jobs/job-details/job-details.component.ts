import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService, Job } from '../job.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  public auth = inject(AuthService);
  private http = inject(HttpClient);

  job: Job | null = null;
  loading = true;
  error: string | null = null;
  applied = false;
  applyLoading = false;
  applyError: string | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.jobService.getJob(id).subscribe({
      next: job => {
        this.job = job;
        this.loading = false;
        this.checkIfApplied();
      },
      error: err => {
        this.error = 'Job not found.';
        this.loading = false;
      }
    });
  }

  checkIfApplied() {
    if (!this.auth.isAuthenticated() || !this.job?.id) return;
    this.http.get<any[]>(`http://localhost:5000/api/applications/user`, {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` }
    }).subscribe({
      next: apps => {
        this.applied = apps.some(app => app.jobId === this.job?.id);
      }
    });
  }

  apply() {
    if (!this.auth.isAuthenticated() || !this.job?.id) return;
    this.applyLoading = true;
    this.applyError = null;
    this.http.post(`http://localhost:5000/api/applications`, { jobId: this.job.id }, {
      headers: { Authorization: `Bearer ${this.auth.getToken()}` }
    }).subscribe({
      next: () => {
        this.applied = true;
        this.applyLoading = false;
      },
      error: err => {
        this.applyError = err?.error?.message || 'Failed to apply.';
        this.applyLoading = false;
      }
    });
  }
}
