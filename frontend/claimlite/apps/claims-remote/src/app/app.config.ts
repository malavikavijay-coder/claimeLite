import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { CLAIMS_ROUTES } from './claims.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(CLAIMS_ROUTES),
    provideHttpClient()
  ]
};
