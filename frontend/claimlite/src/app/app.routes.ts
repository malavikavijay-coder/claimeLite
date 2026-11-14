import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

import { UserListComponent } from './users/user-list.component';
import { UserFormComponent } from './users/user-form.component';

interface ClaimsRemote {
  CLAIMS_ROUTES: Routes;
}

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
    loadChildren: () =>
      loadRemoteModule<ClaimsRemote>({
        type: 'manifest',
        remoteName: 'claims',
        exposedModule: './routes',
      })
        .then((remote) => {
          if (!Array.isArray(remote.CLAIMS_ROUTES)) {
            throw new Error('Claims remote did not export CLAIMS_ROUTES');
          }
          return remote.CLAIMS_ROUTES;
        })
        .catch((error) => {
          console.error('Could not load Claims remote routes', error);
          throw error;
        }),
  },

  {
  path: 'edit-user/:id',
  component: UserFormComponent
},
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
},
];