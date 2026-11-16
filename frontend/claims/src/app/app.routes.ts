import { Routes } from '@angular/router';
import { CLAIMS_ROUTES } from './claims/claims.routes';

export const appRoutes: Routes = [
  {
    path: 'claims',
    children: CLAIMS_ROUTES,
  },
  {
    path: '',
    redirectTo: 'claims',
    pathMatch: 'full',
  },
];
