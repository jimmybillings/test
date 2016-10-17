import {
  inject,
  beforeEachProvidersArray,
  TestBed,
  MockBackend,
  Response,
  ResponseOptions
} from '../../imports/test.imports';

import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';
import { ApiConfig } from './api.config';
import { Error } from './error.service';
import { CurrentUser } from './current-user.model';


export function main() {


  describe('Api Service', () => {
    let connection: any, MockApiConfig: any, MockError: any, mockBackEnd: MockBackend, mockCurrentUser: any;
    mockBackEnd = new MockBackend();
    let loggedInState: boolean = true;
    let responseWith: Function = (object: Object) => new Response(new ResponseOptions({ body: JSON.stringify(object) }));
    let errorResponseWith: Function = (object: Object) => object;

    beforeEach(() => {

      mockBackEnd.connections.subscribe((c: any) => connection = c);
      MockApiConfig = { headers: function () { return 'hi'; }, baseUrl: function () { return 'BASE/'; }, getPortal: function () { return 'core'; } };
      MockError = { dispatch: function (error: any) { return error; } };

      mockCurrentUser = {
        loggedIn: function () { return loggedInState; }
      };

      spyOn(MockError, 'dispatch');
      spyOn(MockApiConfig, 'headers').and.callThrough();
      spyOn(MockApiConfig, 'baseUrl').and.callThrough();

      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          ApiService,
          { provide: ApiConfig, useValue: MockApiConfig },
          { provide: Error, useValue: MockError },
          { provide: MockBackend, useValue: mockBackEnd },
          { provide: CurrentUser, useValue: mockCurrentUser }
        ]
      });
    });

    it('Should corretly build the get method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.get(Api.Identities, 'collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond(responseWith({ status: 200 }));
      }));

    it('Should corretly build the get method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.get(Api.Identities, 'collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond(responseWith({ status: 200 }));
      }));

    it('Should corretly build the get method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.get(Api.Identities, 'collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(errorResponseWith({ status: 401 }));
      }));

    it('Should corretly build the get method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.get(Api.Identities, 'collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(errorResponseWith({ status: 401 }));
      }));

    it('Should corretly build the post method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.post(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond(responseWith({ status: 200 }));
      }));

    it('Should corretly build the post method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.post(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond(responseWith({ status: 200 }));
      }));

    it('Should corretly build the post method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.post(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/identities/v1/api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(errorResponseWith({ status: 401 }));
      }));

    it('Should corretly build the post method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.post(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(errorResponseWith({ status: 401 }));
      }));

    it('Should corretly build the put method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.put(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond(responseWith({ status: 200 }));
      }));

    it('Should corretly build the put method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.put(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond(responseWith({ status: 200 }));
      }));

    it('Should corretly build the put method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.put(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(errorResponseWith({ status: 401 }));
      }));

    it('Should corretly build the put method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.put(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(errorResponseWith({ status: 401 }));
      }));

    it('Should corretly build the delete method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.delete(Api.Identities, 'collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond(responseWith({ status: 200 }));
      }));

    it('Should corretly build the delete method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.delete(Api.Identities, 'collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond(responseWith({ status: 200 }));
      }));

    it('Should corretly build the delete method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.delete(Api.Identities, 'collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(errorResponseWith({ status: 401 }));
      }));

    it('Should corretly build the delete method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.delete(Api.Identities, 'collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(errorResponseWith({ status: 401 }));
      }));
  });
}
