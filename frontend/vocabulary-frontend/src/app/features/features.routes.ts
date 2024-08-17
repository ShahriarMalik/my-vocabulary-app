import { Routes } from '@angular/router';
import { LearnComponent } from './learn/learn.component';
import { A1Component } from './learn/a1/a1.component';
import { A2Component } from './learn/a2/a2.component';
import { B1Component } from './learn/b1/b1.component';
import { B2Component } from './learn/b2/b2.component';
import { C1Component } from './learn/c1/c1.component';
import { C2Component } from './learn/c2/c2.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { WordManagementComponent } from './admin/word-management/word-management.component';
import { ProgressComponent } from './progress/progress.component';
import { authRoutes } from './authentication/auth.routes';

export const featuresRoutes: Routes = [
  { path: 'auth', children: authRoutes },

  {
    path: 'learn',
    component: LearnComponent,
    children: [
      { path: 'a1', component: A1Component },
      { path: 'a2', component: A2Component },
      { path: 'b1', component: B1Component },
      { path: 'b2', component: B2Component },
      { path: 'c1', component: C1Component },
      { path: 'c2', component: C2Component },
    ],
  },

  { path: 'exercises', component: ExercisesComponent },

  { path: 'words-management', component: WordManagementComponent },

  { path: 'progress', component: ProgressComponent },

  // Lazy load the TipsComponent to optimize initial load time
  {
    path: 'tips',
    loadComponent: () =>
      import('./tips/tips.component').then((m) => m.TipsComponent),
  },
];
