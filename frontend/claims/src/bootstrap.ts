import { defineCustomElements } from '@duetds/components/lib/loader';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

defineCustomElements(window);

bootstrapApplication(App, appConfig).catch((error) => console.error(error));
