import { Routes } from '@angular/router';
import { LearnComponent } from './learn/learn.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { authRoutes } from './authentication/auth.routes';
import { adminGuard } from '../core/guards/admin.guard';
import { loginGuard } from '../core/guards/login.guard';

export const featuresRoutes: Routes = [
  { path: 'auth', children: authRoutes },

  {
    path: 'learn',
    component: LearnComponent,
    title: $localize`:6899134966533859260:Learn`,
  },

  {
    path: 'exercises',
    component: ExercisesComponent,
    title: $localize`:5815398842801469550:Exercises`,
  },

  {
    path: 'words-management',
    loadComponent: () =>
      import('./admin/words-management/words-management.component').then(
        (m) => m.WordsManagementComponent
      ),
    title: $localize`:141084884839689192:Words Management`,
    canActivate: [adminGuard],
  },

  {
    path: 'exercises-management',
    loadComponent: () =>
      import(
        './admin/exercises-management/exercises-management.component'
      ).then((m) => m.ExerciseManagementComponent),
    title: $localize`:exercisesManagement: Exercises Management`,
    canActivate: [adminGuard],
  },

  {
    path: 'progress',
    loadComponent: () =>
      import('./progress/progress.component').then((m) => m.ProgressComponent),
    title: $localize`:3419681791450150574:Progress`,
    canActivate: [loginGuard],
  },

  {
    path: 'tips',
    loadComponent: () =>
      import('./tips/tips.component').then((m) => m.TipsComponent),
    title: $localize`:3285315590661482349:Tips`,
  },
];
