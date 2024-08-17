import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { featuresRoutes } from './features/features.routes';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    title: $localize`:2821179408673282599:Home`,
  },
  ...featuresRoutes,
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
