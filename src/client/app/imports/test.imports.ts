// BOILER PLATE
import { LocationStrategy } from '@angular/common';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { provide, Renderer, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterOutletMap } from '@angular/router';
import { FormBuilder } from '@angular/forms';
// DIRECTIVES

// STORES & PROVIDERS
import { WAZEE_STORES, WAZEE_PROVIDERS } from './wazee';

// SERVICES NOT IN WAZEE_PROVIDERS
import { AdminService } from '../+admin/services/admin.service';
import { ConfigService } from '../+admin/services/config.service';
import { User } from '../+user-management/services/user.data.service';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';

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
export { CurrentUser } from '../shared/services/current-user.model';
export { inject, addProviders } from '@angular/core/testing';

export { Response, ResponseOptions, RequestMethod, RequestOptions, Headers } from '@angular/http';


export const beforeEachProvidersArray: Array<any> = [
  ...WAZEE_STORES,
  ...WAZEE_PROVIDERS,
  WzNotificationService,
  ConfigService,
  AdminService,
  User,
  Renderer,
  LocationStrategy,
  MockBackend,
  BaseRequestOptions,
  RouterOutletMap,
  FormModel,
  FormBuilder,
  provide(Http, {
    useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
    deps: [MockBackend, BaseRequestOptions]
  }),
  { provide: Router, useClass: MockRouter },
  { provide: ActivatedRoute, useClass: MockActivatedRoute },
  ChangeDetectorRef
];
