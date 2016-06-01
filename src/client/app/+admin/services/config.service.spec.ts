import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { ConfigService } from './config.service';
import { ApiConfig } from '../../shared/services/api.config';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { RouteSegment } from '@angular/router';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';

export function main() {
  describe('Config Service', () => {

    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(RouteSegment, { useValue: new RouteSegment([], { site: 'core' }, null, null, null) }),
      ApiConfig,
      ConfigService,
    ]);

    it('Should create instance variables for http, and apiConfig', inject([ConfigService, MockBackend], (service: ConfigService, mockBackend: MockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
    }));
  });
}
