/*
 * These are globally available services in any component or any other service
 */

// Angular 2
import { provide } from '@angular/core';
import { FORM_PROVIDERS, APP_BASE_HREF } from '@angular/common';
// Angular 2 Http
import { HTTP_PROVIDERS } from '@angular/http';
// Angular 2 Router
import { ROUTER_PROVIDERS } from '@angular/router';

// Angular 2 Material
// TODO(gdi2290): replace with @angular2-material/all
import { MATERIAL_PROVIDERS } from './material';

// Wazee 
import { WAZEE_PROVIDERS } from './wazee';
/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  ...MATERIAL_PROVIDERS,
  ...ROUTER_PROVIDERS,
  ...WAZEE_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' })
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
