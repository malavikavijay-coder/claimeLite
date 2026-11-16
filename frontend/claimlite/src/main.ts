import { initFederation } from '@angular-architects/module-federation';

initFederation('/mf.manifest.json', true)
  .then(() => import('./bootstrap'))
  .catch((error) => console.error('Unable to initialize Module Federation', error));