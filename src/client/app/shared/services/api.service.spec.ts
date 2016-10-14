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

    it('Should corretly build the request method given a valid request and a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.request('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
          expect(MockApiConfig.headers).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the request method given a valid request and a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.request('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
          expect(MockApiConfig.headers).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the request method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.request('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the request method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.request('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the get method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.get('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the get2 method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.get2(Api.Identities, 'collection/1').subscribe((res) => {
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
        service.get('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the get2 method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.get2(Api.Identities, 'collection/1').subscribe((res) => {
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
        service.get('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the get2 method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.get2(Api.Identities, 'collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(responseWith({ status: 401 }));
      }));

    it('Should corretly build the get method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.get('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the get2 method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.get2(Api.Identities, 'collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(responseWith({ status: 401 }));
      }));

    it('Should corretly build the post method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.post('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the post2 method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.post2(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
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
        service.post('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the post2 method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.post2(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
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
        service.post('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the post2 method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.post2(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/identities/v1/api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(responseWith({ status: 401 }));
      }));

    it('Should corretly build the post method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.post('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the post2 method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.post2(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(responseWith({ status: 401 }));
      }));

    it('Should corretly build the put method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.put('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the put2 method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.put2(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
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
        service.put('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the put2 method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.put2(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
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
        service.put('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the put2 method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.put2(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(responseWith({ status: 401 }));
      }));

    it('Should corretly build the put method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.put('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the put2 method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.put2(Api.Identities, 'collection/1', { body: { userId: 3 } }).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(responseWith({ status: 401 }));
      }));

    it('Should corretly build the delete method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.delete('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the delete2 method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.delete2(Api.Identities, 'collection/1').subscribe((res) => {
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
        service.delete('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the delete2 method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.delete2(Api.Identities, 'collection/1').subscribe((res) => {
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
        service.delete('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the delete2 method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.delete2(Api.Identities, 'collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(responseWith({ status: 401 }));
      }));

    it('Should corretly build the delete method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.delete('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the delete2 method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.delete2(Api.Identities, 'collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/identities/v1/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError(responseWith({ status: 401 }));
      }));

    it('Should corretly build the patch method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.patch('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the patch method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.patch('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the patch method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.patch('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the patch method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.patch('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3, siteName: 'core' }));
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the head method given a valid request for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.head('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the head method given a valid request for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.head('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the head method given a valid request and handle an error based response for a logged IN user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = true;
        service.head('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the head method given a valid request and handle an error based response for a logged OUT user',
      inject([ApiService], (service: ApiService) => {
        loggedInState = false;
        service.head('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('BASE/api/collection/1?siteName=core');
          expect(MockApiConfig.headers).toHaveBeenCalled();
          expect(MockApiConfig.baseUrl).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));
  });
}
