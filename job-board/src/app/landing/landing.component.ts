import { Component, inject } from '@angular/core';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { JobService, Job } from '../jobs/job.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, NgbModalModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  private modalService = inject(NgbModal);
  private jobService = inject(JobService);

  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  categories = [
    { name: 'IT & Software', icon: 'bi-laptop' },
    { name: 'Finance', icon: 'bi-bar-chart-line' },
    { name: 'HR & Recruitment', icon: 'bi-people' },
    { name: 'Sales & Marketing', icon: 'bi-shop-window' }
  ];
  selectedCategory: string | null = null;

  ngOnInit() {
    this.fetchJobs();
  }

  fetchJobs() {
    this.loading = true;
    this.jobService.getJobs().subscribe({
      next: jobs => {
        this.jobs = jobs;
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load jobs.';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchTerm || job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || job.company.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || job.description.toLowerCase().includes(this.selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  clearCategory() {
    this.selectedCategory = null;
    this.applyFilters();
  }

  openLogin() {
    this.modalService.open(LoginComponent, { centered: true });
  }

  openRegister() {
    this.modalService.open(RegisterComponent, { centered: true });
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/fallback-logo.png';
    }
  }
}
