/*
 * These are globally available services in any component or any other service
 */

// Angular 2
import { provide } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { provideForms, disableDeprecatedForms } from '@angular/forms';

// Angular 2 Http
import { HTTP_PROVIDERS } from '@angular/http';
// Angular 2 Router
import { provideRouter, RouterConfig } from '@angular/router';

// Angular 2 Material
// TODO(gdi2290): replace with @angular2-material/all
import { MATERIAL_PROVIDERS } from './material';
import { AssetResolver } from '../+asset/services/asset.resolver';

// Wazee 
import { WAZEE_PROVIDERS, WAZEE_ROUTES } from './wazee';
/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/

export const APP_ROUTER_PROVIDERS: RouterConfig = [
  AssetResolver,
  provideRouter(WAZEE_ROUTES),
];

export const APPLICATION_PROVIDERS = [
  ...HTTP_PROVIDERS,
  ...MATERIAL_PROVIDERS,
  ...WAZEE_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' }),
  provideForms(),
  disableDeprecatedForms()
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
