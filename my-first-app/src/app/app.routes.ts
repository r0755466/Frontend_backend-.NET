import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './tasks/tasks.component';
import { DashboardsComponent } from './dashboards/dashboards.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home by default
  { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'dashboards', component: DashboardsComponent },
  { path: '**', redirectTo: '/home' } // Wildcard route for invalid paths
];