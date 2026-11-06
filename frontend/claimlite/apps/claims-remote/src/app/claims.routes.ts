import { Routes } from '@angular/router';
import { ClaimListComponent } from './claims/claim-list.component';
import { ClaimFormComponent } from './claims/claim-form.component';

export const CLAIMS_ROUTES: Routes = [
  {
    path: '',
    component: ClaimListComponent
  },
  {
    path: 'add-claim',
    component: ClaimFormComponent
  }
];

