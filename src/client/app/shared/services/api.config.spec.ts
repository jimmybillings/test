import {
  beforeEachProviders,
  describe,
  Headers,
  inject,
  expect,
  it,
} from '../../imports/test.imports';

import { ApiConfig } from './api.config';

export function main() {
  describe('Api config', () => {
    beforeEachProviders(() => [
      ApiConfig
    ]);

    it('Should create an instance of authorization headers, with correct header info',
      inject([ApiConfig], (service: ApiConfig) => {
        localStorage.clear();
        expect(service.authHeaders() instanceof Headers).toBeTruthy();
        expect(service.authHeaders().has('Content-Type')).toBeTruthy();
        expect(service.authHeaders().getAll('Content-Type')).toEqual(['application/json']);
        expect(service.authHeaders().has('Authorization')).toBeTruthy();
        expect(service.authHeaders().getAll('Authorization')).toEqual(['Bearer null']);
        expect(service.authHeaders().has('Accept')).toBeTruthy();
        expect(service.authHeaders().getAll('Accept')).toEqual(['application/json']);
      }));

    it('Should create an instance of api headers, with correct header info',
      inject([ApiConfig], (service: ApiConfig) => {
        expect(service.headers() instanceof Headers).toBeTruthy();
        expect(service.headers().has('Content-Type')).toBeTruthy();
        expect(service.headers().getAll('Content-Type')).toEqual(['application/json']);
        expect(service.authHeaders().has('Accept')).toBeTruthy();
        expect(service.authHeaders().getAll('Accept')).toEqual(['application/json']);
      }));

    it('should return portal name. If none is set, it should return "core"', inject([ApiConfig], (service: ApiConfig) => {
      expect(service.getPortal()).toEqual('core');
    }));

    it('Should set portal name with value passed in', inject([ApiConfig], (service: ApiConfig) => {
      let portalName = 'newportalname';
      service.setPortal(portalName);
      expect(service.getPortal()).toEqual(portalName);
    }));

    it('Should return the Root, path, query for the CMS enpoint', inject([ApiConfig], (service: ApiConfig) => {
      expect(service.cms('root')).toEqual('https://cms.dev.wzplatform.com/');
      expect(service.cms('path')).toEqual('/wp-json/wp/v2/pages');
      expect(service.cms('query')).toEqual('?filter[name]=');
    }));
  });
}
