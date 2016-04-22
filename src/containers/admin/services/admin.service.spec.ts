import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { AdminService } from './admin.service';
import { ApiConfig } from '../../../common/config/api.config';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { CurrentUser, currentUser } from '../../../common/models/current-user.model';
import { provideStore} from '@ngrx/store';

export function main() {
  describe('Authentication data service', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({currentUser: currentUser}),
      ApiConfig,
      AdminService,
      CurrentUser
    ]);

    it('Should create instance variables for http, apiconfig, apiUrls', inject([AdminService, MockBackend], (service, mockBackend) => {
      expect(service._http).toBeDefined();
      expect(service._apiConfig).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));
  });
}
