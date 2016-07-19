// BOILER PLATE
import { ActivatedRoute, Router } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { provide, PLATFORM_PIPES } from '@angular/core';
import { TranslatePipe}  from 'ng2-translate/ng2-translate';

// STORES & PROVIDERS
import { WAZEE_STORES, WAZEE_PROVIDERS } from './wazee';

// Pure Components
import { APP_COMPONENT_DIRECTIVES } from './app.component.imports';


// EXPORTS
class MockRouter {
  navigate(params: any) { return params; }
}
class MockActivatedRoute {}
export { Observable } from 'rxjs/Rx';
export { TestComponentBuilder } from '@angular/compiler/testing';
export { CurrentUser } from '../shared/services/current-user.model';
export { describe, expect, inject, it, beforeEachProviders } from '@angular/core/testing';

export const beforeEachProvidersArray: Array<any> = [
  ...WAZEE_STORES,
  ...WAZEE_PROVIDERS,
  ...APP_COMPONENT_DIRECTIVES,
  MockBackend,
  BaseRequestOptions,
  provide(Http, {
    useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
    deps: [MockBackend, BaseRequestOptions]
  }),
  provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
  { provide: Router, useClass: MockRouter },
  { provide: ActivatedRoute, useClass: MockActivatedRoute },
];
