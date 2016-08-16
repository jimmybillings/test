// BOILER PLATE
import { LocationStrategy } from '@angular/common';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { TranslatePipe}  from 'ng2-translate/ng2-translate';
import { provide, PLATFORM_PIPES, Renderer } from '@angular/core';
import { ActivatedRoute, Router, RouterOutletMap } from '@angular/router';
import { FormBuilder, provideForms, disableDeprecatedForms } from '@angular/forms';
import { MATERIAL_PROVIDERS } from './material';
// DIRECTIVES
import { DIRECTIVES } from './directives';

// STORES & PROVIDERS
import { WAZEE_STORES, WAZEE_PROVIDERS } from './wazee';

// SERVICES NOT IN WAZEE_PROVIDERS
import { AdminService } from '../+admin/services/admin.service';
import { ConfigService } from '../+admin/services/config.service';
import { User } from '../+user-management/services/user.data.service';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';

// PURE_COMPONENTS
import { APP_COMPONENT_DIRECTIVES } from './app.component.imports';

// MODELS
import { FormModel } from '../shared/components/wz-form/wz.form.model';

// EXPORTS
class MockRouter {
  navigate(params: any) { return params; }
}
class MockActivatedRoute {}
export { Store } from '@ngrx/store';
export { Observable } from 'rxjs/Rx';
export { Injectable } from '@angular/core';
export { ActivatedRoute } from '@angular/router';
export { MockBackend } from '@angular/http/testing';
export { TestComponentBuilder } from '@angular/core/testing';
export { CurrentUser } from '../shared/services/current-user.model';
export { inject, addProviders } from '@angular/core/testing';

export { Response, ResponseOptions, RequestMethod, RequestOptions, Headers } from '@angular/http';


export const beforeEachProvidersArray: Array<any> = [
  ...WAZEE_STORES,
  ...WAZEE_PROVIDERS,
  ...APP_COMPONENT_DIRECTIVES,
  ...DIRECTIVES,
  ...MATERIAL_PROVIDERS,
  WzNotificationService,
  ConfigService,
  AdminService,
  User,
  FormBuilder,
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
  { provide: PLATFORM_PIPES, useValue: TranslatePipe, multi: true},
  { provide: Router, useClass: MockRouter },
  { provide: ActivatedRoute, useClass: MockActivatedRoute },
];
