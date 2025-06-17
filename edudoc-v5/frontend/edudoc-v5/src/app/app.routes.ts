import { Routes } from '@angular/router';
import { AuthTestComponent } from './components/auth-test/auth-test.component';

export const routes: Routes = [
  { path: '', component: AuthTestComponent },
  { path: 'auth-test', component: AuthTestComponent },
  { path: '**', redirectTo: '' }
];
