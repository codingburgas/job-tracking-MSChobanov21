import { Component } from '@angular/core';
import { JobService, Job } from '../job.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent {
  job: Job = { title: '', description: '', company: '', userId: 0 };
  success = '';
  error = '';
  loading = false;

  constructor(private jobService: JobService) {}

  submit() {
    this.loading = true;
    this.success = '';
    this.error = '';
    this.jobService.createJob(this.job).subscribe({
      next: (res) => {
        this.success = 'Job created!';
        this.job = { title: '', description: '', company: '', userId: 0 };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create job';
        this.loading = false;
      }
    });
  }
}
