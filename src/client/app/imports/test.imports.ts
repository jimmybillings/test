// BOILER PLATE
import { LocationStrategy } from '@angular/common';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { Renderer, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterOutletMap } from '@angular/router';
import { FormBuilder } from '@angular/forms';
// DIRECTIVES

// STORES & PROVIDERS
import { WAZEE_PROVIDERS, WAZEE_STORES } from './wazee';

// SERVICES NOT IN WAZEE_PROVIDERS
import { AdminService } from '../+admin/services/admin.service';
import { ConfigService } from '../+admin/services/config.service';
import { WzNotificationService } from '../shared/services/wz.notification.service';

// MODELS
import { FormModel } from '../shared/modules/wz-form/wz.form.model';

// EXPORTS
class MockRouter {
  navigate(params: any) { return params; }
}
class MockActivatedRoute { }
export { Store } from '@ngrx/store';
export { Observable } from 'rxjs/Observable';
export { Injectable } from '@angular/core';
export { ActivatedRoute } from '@angular/router';
export { MockBackend } from '@angular/http/testing';
export { CurrentUserService } from '../shared/services/current-user.service';
export { inject, TestBed } from '@angular/core/testing';
export { Response, ResponseOptions, RequestMethod, RequestOptions, Headers } from '@angular/http';
import { provideStore } from '@ngrx/store';

export const beforeEachProvidersArray: Array<any> = [
  provideStore(WAZEE_STORES),
  WAZEE_PROVIDERS,
  WzNotificationService,
  ConfigService,
  AdminService,
  Renderer,
  LocationStrategy,
  MockBackend,
  BaseRequestOptions,
  RouterOutletMap,
  FormModel,
  FormBuilder,
  {
    provide: Http,
    useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
      return new Http(backend, defaultOptions);
    },
    deps: [MockBackend, BaseRequestOptions]
  },
  { provide: Router, useClass: MockRouter },
  { provide: ActivatedRoute, useClass: MockActivatedRoute },
  ChangeDetectorRef
];
