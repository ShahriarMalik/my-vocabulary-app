import { Routes } from '@angular/router';
import { authRoutes } from './features/authentication/auth.routes';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auth', children: authRoutes },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  // { path: '', component: SidebarComponent, pathMatch: 'full' },
];
