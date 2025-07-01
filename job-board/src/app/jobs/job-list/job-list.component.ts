import { Component, OnInit } from '@angular/core';
import { JobService, Job } from '../job.service';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  categories = [
    { name: 'IT & Software', icon: 'bi-laptop' },
    { name: 'Finance', icon: 'bi-bar-chart-line' },
    { name: 'HR & Recruitment', icon: 'bi-people' },
    { name: 'Sales & Marketing', icon: 'bi-shop-window' }
  ];
  selectedCategory: string | null = null;

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.fetchJobs();
  }

  fetchJobs() {
    this.loading = true;
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load jobs';
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

  goToJob(id: number) {
    this.router.navigate(['/jobs', id]);
  }
}
