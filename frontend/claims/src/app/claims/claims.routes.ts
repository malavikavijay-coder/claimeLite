import { Routes } from '@angular/router';
import { ClaimListComponent } from './claim-list.component';
import { ClaimFormComponent } from './claim-form.component';

export const CLAIMS_ROUTES: Routes = [
  {
    path: '',
    component: ClaimListComponent,
  },
  {
    path: 'add-claim',
    component: ClaimFormComponent,
  },
  {
    path: 'edit-claim/:id',
    component: ClaimFormComponent,
  },
];
