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
    let mockBackend: MockBackend;
    let connection: any;
    mockBackend = new MockBackend();
    beforeEach(() => {
      mockBackend.connections.subscribe((c: any) => connection = c);
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          { provide: MockBackend, useValue: mockBackend }
        ]
      });
    });

    it('Should make a request to login a new user', inject([Authentication], (service: Authentication) => {
      service.create(setUser()).subscribe((res: any) => {
        expect(connection.request.url.split('.com')[1]).toBe('/api/identities/v1/login?siteName=core');
        expect(connection.request._body).toMatch(JSON.stringify(setUser()).slice(1, -1));
      });
      connection.mockRespond(new Response(new ResponseOptions({ body: setUser() })));
    }));

    it('Should make a request to destroy the login of a user', inject([Authentication], (service: Authentication) => {
      service.destroy().subscribe((res: any) => {
        expect(connection.request.url.split('.com')[1]).toBe('/api/identities/v1/invalidate?siteName=core');
      });
      connection.mockRespond(new Response(new ResponseOptions({ body: {} })));
    }));
  });

  function setUser() {
    return {
      'username': 'test@email.com',
      'password': 'password'
    };
  }
}
