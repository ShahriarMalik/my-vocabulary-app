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
import { adminGuard } from '../core/guards/admin.guard';

export const featuresRoutes: Routes = [
  { path: 'auth', children: authRoutes },

  {
    path: 'learn',
    component: LearnComponent,
    title: $localize`:6899134966533859260:Learn`,
    children: [
      {
        path: 'a1',
        component: A1Component,
        title: $localize`:6956850829747418160:Learn A1`,
      },
      {
        path: 'a2',
        component: A2Component,
        title: $localize`:3444445563006094628:Learn A2`,
      },
      {
        path: 'b1',
        component: B1Component,
        title: $localize`:817717124019791171:Learn B1`,
      },
      {
        path: 'b2',
        component: B2Component,
        title: $localize`:1926908665342515051:Learn B2`,
      },
      {
        path: 'c1',
        component: C1Component,
        title: $localize`:7096307349180277898:Learn C1`,
      },
      {
        path: 'c2',
        component: C2Component,
        title: $localize`:1319065673635617669:Learn C2`,
      },
    ],
  },

  {
    path: 'exercises',
    component: ExercisesComponent,
    title: $localize`:5815398842801469550:Exercises`,
  },

  {
    path: 'words-management',
    component: WordManagementComponent,
    title: $localize`:141084884839689192:Words Management`,
    canActivate: [adminGuard],
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
