import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { provide } from '@angular/core';
import { AssetData, assets } from '../../+search/services/asset.data.service';
import { ApiConfig } from '../../shared/services/api.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { provideStore } from '@ngrx/store';
import { Error } from '../../shared/services/error.service';

export function main() {
  describe('Collection service', () => {


    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      ROUTER_FAKE_PROVIDERS,
      provideStore({ assets: assets }),
      AssetData,
      ApiConfig,
      CurrentUser,
      Error
    ]);

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls',
      inject([AssetData], (service: AssetData) => {
        expect(service.http).toBeDefined();
        expect(service.apiConfig).toBeDefined();
        expect(service.currentUser).toBeDefined();
      }));

  });

}
