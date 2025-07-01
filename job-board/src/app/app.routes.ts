import { Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobFormComponent } from './jobs/job-form/job-form.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MyApplicationsComponent } from './applications/my-applications/my-applications.component';
import { JobDetailsComponent } from './jobs/job-details/job-details.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'applications/my', component: MyApplicationsComponent, canActivate: [authGuard] },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserFormComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/new', component: JobFormComponent },
  { path: 'jobs/:id', component: JobDetailsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }
];
