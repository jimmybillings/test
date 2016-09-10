import {
  beforeEachProvidersArray,
  TestBed,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
} from '../../imports/test.imports';

import { Authentication } from './authentication.data.service';

export function main() {
  describe('Authentication data service', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
      ]
    }));

    it('Should create instance variables for http, apiconfig, apiUrls', inject([Authentication, MockBackend], (service: Authentication, mockBackend: MockBackend) => {
      expect(service.http).toBeDefined();
      expect(service.apiConfig).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));

    it('Should make a request to login a new user', inject([Authentication, MockBackend], (service: Authentication, mockBackend: MockBackend) => {
      let connection: any;
      connection = mockBackend.connections.subscribe((c: any) => connection = c);
      service.create(setUser()).subscribe((res: any) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/login');
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: setUser()
        })
      ));
    }));

    it('Should make a request to destroy the login of a user', inject([Authentication, MockBackend], (service: Authentication, mockBackend: MockBackend) => {
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);
      service.destroy().subscribe((res: any) => {
        expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/invalidate');
        // let authorizationHeader = checkAuthInHeader(connection.request.headers._headersMap.entries_);
        // expect(authorizationHeader).toEqual(['Authorization']);
      });
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: {}
        })
      ));
    }));
  });

  function setUser() {
    return {
      'username': 'test@email.com',
      'password': 'password'
    };
  }
}
