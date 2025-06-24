import { Routes } from '@angular/router';
import { AuthTestComponent } from './features/auth-test/auth-test.component';

export const routes: Routes = [
  { path: '', component: AuthTestComponent },
  { path: 'auth-test', component: AuthTestComponent },
  {
    path: 'encounters',
    loadChildren: () => import('./features/encounter-form/encounter-form.module').then(m => m.EncounterFormModule)
  },
  { path: '**', redirectTo: '' }
];
