// BOILER PLATE
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute, Router, RouterOutletMap } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { provide, PLATFORM_PIPES, Renderer } from '@angular/core';
import { TranslatePipe}  from 'ng2-translate/ng2-translate';
import { provideForms, disableDeprecatedForms } from '@angular/forms';

// STORES & PROVIDERS
import { WAZEE_STORES, WAZEE_PROVIDERS } from './wazee';

// Pure Components
import { APP_COMPONENT_DIRECTIVES } from './app.component.imports';

// MODELS
import {FormModel} from '../shared/components/wz-form/wz.form.model';

// EXPORTS
class MockRouter {
  navigate(params: any) { return params; }
}
class MockActivatedRoute {}
export { Store } from '@ngrx/store';
export { Observable } from 'rxjs/Rx';
export { Injectable } from '@angular/core';
export { MockBackend } from '@angular/http/testing';
export { TestComponentBuilder } from '@angular/compiler/testing';
export { CurrentUser } from '../shared/services/current-user.model';
export { describe, expect, inject, it, beforeEachProviders } from '@angular/core/testing';
export { Response, ResponseOptions, RequestMethod, RequestOptions, Headers } from '@angular/http';

export const beforeEachProvidersArray: Array<any> = [
  ...WAZEE_STORES,
  ...WAZEE_PROVIDERS,
  ...APP_COMPONENT_DIRECTIVES,
  disableDeprecatedForms(),
  provideForms(),
  Renderer,
  LocationStrategy,
  MockBackend,
  BaseRequestOptions,
  RouterOutletMap,
  FormModel,
  provide(Http, {
    useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
    deps: [MockBackend, BaseRequestOptions]
  }),
  provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
  { provide: Router, useClass: MockRouter },
  { provide: ActivatedRoute, useClass: MockActivatedRoute },
];
