import { Routes } from '@angular/router';
import { LearnComponent } from './learn/learn.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { WordsManagementComponent } from './admin/words-management/words-management.component';
import { ProgressComponent } from './progress/progress.component';
import { authRoutes } from './authentication/auth.routes';
import { adminGuard } from '../core/guards/admin.guard';
import { ExerciseManagementComponent } from './admin/exercises-management/exercises-management.component';

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
    component: WordsManagementComponent,
    title: $localize`:141084884839689192:Words Management`,
    canActivate: [adminGuard],
  },

  {
    path: 'exercises-management',
    component: ExerciseManagementComponent,
    title: $localize`:exercisesManagement: Exercises Management`,
  },

  {
    path: 'progress',
    component: ProgressComponent,
    title: $localize`:3419681791450150574:Progress`,
  },

  {
    path: 'tips',
    loadComponent: () =>
      import('./tips/tips.component').then((m) => m.TipsComponent),
    title: $localize`:3285315590661482349:Tips`,
  },
];
