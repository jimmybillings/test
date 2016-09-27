import {
  beforeEachProvidersArray,
  TestBed,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
} from '../../imports/test.imports';

import { User } from './user.data.service';

export function main() {
  describe('User data service', () => {
    let mockBackend: MockBackend;
    let connection: any;
    mockBackend = new MockBackend();
    beforeEach(() =>  {
      mockBackend.connections.subscribe((c: any) => connection = c);
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          { provide: MockBackend, useValue: mockBackend }
        ]
      });
    });

    it('Should create instance variables for http, apiconfig, currentUser, apiUrls', inject([User], (service: User) => {
      expect(service.api).toBeDefined();
      expect(service._apiUrls).toBeDefined();
    }));

    it('Should make a request to create a new user', inject([User], (service: User) => {
      service.create(setUser()).subscribe((res) => {
        expect(connection.request.url.indexOf('/api/identities/v1/user/register') !== -1).toBe(true);
        expect(connection.request._body).toEqual(JSON.stringify(setUser()));
      });
      connection.mockRespond(new Response(new ResponseOptions({body: setUser()})));
    }));

    it('Should make a request to get a current user object', inject([User], (service: User) => {
      service.get().subscribe((res) => {
        expect(connection.request.url.indexOf('/api/identities/v1/user/currentUser') !== -1).toBe(true);
      });
      connection.mockRespond(200);
    }));
  });

  function setUser() {
    return {
      'lastUpdated': '2016-01-14T16:46:21Z',
      'createdOn': '2016-01-14T16:46:21Z',
      'id': 6,
      'emailAddress': 'test_email@email.com',
      'password': '5daf7de08c0014ec2baa13a64b35a4e0',
      'firstName': 'first',
      'lastName': 'last',
      'siteName': 'core',
      'accountIds': [4]
    };
  }
}
