import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { featuresRoutes } from './features/features.routes';

export const routes: Routes = [
  // Home route with breadcrumb
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { breadcrumb: 'Home' },
  },

  // Spread feature routes and add breadcrumb data in each of those routes as needed
  ...featuresRoutes.map((route) => ({
    ...route,
    data: { breadcrumb: route.data?.['breadcrumb'] || 'Feature' }, // Default to 'Feature' if no breadcrumb specified
  })),

  // Wildcard route with redirection and no breadcrumb
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
