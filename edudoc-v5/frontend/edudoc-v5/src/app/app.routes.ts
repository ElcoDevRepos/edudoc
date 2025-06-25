import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/encounters', pathMatch: 'full' },
  {
    path: 'encounters',
    loadChildren: () => import('./features/encounter-form/encounter-form.module').then(m => m.EncounterFormModule)
  },
  { path: '**', redirectTo: '/encounters' }
];
