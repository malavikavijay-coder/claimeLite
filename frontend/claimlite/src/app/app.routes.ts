import { Routes } from '@angular/router';

import { UserListComponent } from './users/user-list.component';
import { UserFormComponent } from './users/user-form.component';
import { ClaimListComponent } from './claims/claim-list.component';
import { ClaimFormComponent } from './claims/claim-form.component';

export const appRoutes: Routes = [
  {
    path: 'users',
    component: UserListComponent
  },

  {
    path: 'add-user',
    component: UserFormComponent
  },

  {
    path: 'claims',
    component: ClaimListComponent
  },

  {
    path: 'add-claim',
    component: ClaimFormComponent
  },

  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];