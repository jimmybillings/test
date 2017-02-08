// BOILER PLATE
import { LocationStrategy } from '@angular/common';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { Renderer, ChangeDetectorRef } from '@angular/core';
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
import { AssetData } from '../+search/services/asset.data.service';

// MODELS
import { FormModel } from '../shared/modules/wz-form/wz.form.model';

// EXPORTS
class MockRouter {
  navigate(params: any) { return params; }
}
class MockActivatedRoute { }
export { Store } from '@ngrx/store';
export { Observable } from 'rxjs/Rx';
export { Injectable } from '@angular/core';
export { ActivatedRoute } from '@angular/router';
export { MockBackend } from '@angular/http/testing';
export { CurrentUserService } from '../shared/services/current-user.service';
export { inject, TestBed } from '@angular/core/testing';

export { Response, ResponseOptions, RequestMethod, RequestOptions, Headers } from '@angular/http';

import { provideStore } from '@ngrx/store';
// const stores = provideStore(WAZEE_STORES);

export const beforeEachProvidersArray: Array<any> = [
  provideStore(WAZEE_STORES),
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
  AssetData,
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
