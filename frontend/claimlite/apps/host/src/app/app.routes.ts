import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

import { UserListComponent } from './users/user-list.component';
import { UserFormComponent } from './users/user-form.component';

export const appRoutes: Routes = [
  // User Directory in Host
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'add-user',
    component: UserFormComponent
  },

  // Dynamic remote loading for Claims Remote
  {
    path: 'claims',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './routes'
      }).then((m) => m.CLAIMS_ROUTES)
  },

  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];
