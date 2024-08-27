import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { featuresRoutes } from './features/features.routes';
import { CefrLessonSelectorComponent } from './shared/components/cefr-lesson-selector/cefr-lesson-selector.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    title: $localize`:2821179408673282599:Home`,
  },
  ...featuresRoutes,
  {
    path: 'cefr',
    component: CefrLessonSelectorComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
