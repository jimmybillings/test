/*
 * These are globally available directives in any template
 */

import { PLATFORM_DIRECTIVES, provide, Provider } from '@angular/core';
// Angular 2 Router
// import { ROUTER_DIRECTIVES } from '@angular/router';

import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
// Angular 2 Material 2
// TODO(gdi2290): replace with @angular2-material/all
import { MATERIAL_DIRECTIVES } from './material';

// application_directives: directives that are global through out the application
export const APPLICATION_DIRECTIVES = [
  // ...ROUTER_DIRECTIVES,
  ...MATERIAL_DIRECTIVES,
  ...REACTIVE_FORM_DIRECTIVES
];

export const DIRECTIVES:Provider[] = [
  provide(PLATFORM_DIRECTIVES, { multi: true, useValue: APPLICATION_DIRECTIVES })
];
