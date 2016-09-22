import {
  inject,
  beforeEachProvidersArray,
  TestBed,
  MockBackend,
} from '../../imports/test.imports';

import { ApiService } from './api.service';
import { ApiConfig } from './api.config';
import { Error } from './error.service';
export function main() {


  describe('Api Service', () => {
    let connection: any, MockApiConfig: any, MockError: any, mockBackEnd: MockBackend;
    mockBackEnd = new MockBackend();

    beforeEach(() => {

      mockBackEnd.connections.subscribe((c: any) => connection = c);
      MockApiConfig = { userHeaders: function () { return 'hi'; }, baseUrl: function () { return 'lskdfj'; } };
      MockError = { dispatch: function (error: any) { return error; } };
      spyOn(MockError, 'dispatch');
      spyOn(MockApiConfig, 'userHeaders').and.callThrough();

      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          ApiService,
          { provide: ApiConfig, useValue: MockApiConfig },
          { provide: Error, useValue: MockError },
          { provide: MockBackend, useValue: mockBackEnd }
        ]
      });
    });

    it('Should corretly build the request method given a valid request',
      inject([ApiService], (service: ApiService) => {
        service.request('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('api/collection/1');
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the request method given a valid request and handle an error based response',
      inject([ApiService], (service: ApiService) => {
        service.request('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('api/collection/1');
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the get method given a valid request',
      inject([ApiService], (service: ApiService) => {
        service.get('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('api/collection/1');
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the get method given a valid request and handle an error based response',
      inject([ApiService], (service: ApiService) => {
        service.get('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('api/collection/1');
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the post method given a valid request',
      inject([ApiService], (service: ApiService) => {
        service.post('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the post method given a valid request and handle an error based response',
      inject([ApiService], (service: ApiService) => {
        service.post('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the put method given a valid request',
      inject([ApiService], (service: ApiService) => {
        service.put('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the put method given a valid request and handle an error based response',
      inject([ApiService], (service: ApiService) => {
        service.put('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the delete method given a valid request',
      inject([ApiService], (service: ApiService) => {
        service.delete('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('api/collection/1');
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the delete method given a valid request and handle an error based response',
      inject([ApiService], (service: ApiService) => {
        service.delete('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('api/collection/1');
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the patch method given a valid request',
      inject([ApiService], (service: ApiService) => {
        service.patch('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the patch method given a valid request and handle an error based response',
      inject([ApiService], (service: ApiService) => {
        service.patch('api/collection/1', JSON.stringify({ userId: 3 })).subscribe((res) => {
          expect(connection.request.url).toBe('api/collection/1');
          expect(connection.request._body).toEqual(JSON.stringify({ userId: 3 }));
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));

    it('Should corretly build the head method given a valid request',
      inject([ApiService], (service: ApiService) => {
        service.head('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 200 });
          expect(connection.request.url).toBe('api/collection/1');
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        });
        connection.mockRespond({ status: 200 });
      }));

    it('Should corretly build the head method given a valid request and handle an error based response',
      inject([ApiService], (service: ApiService) => {
        service.head('api/collection/1').subscribe((res) => {
          expect(connection.request.url).toBe('api/collection/1');
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        }, (error) => {
          expect(MockError.dispatch).toHaveBeenCalledWith({ status: 401 });
          expect(error).toEqual({ status: 401 });
        });
        connection.mockError({ status: 401 });
      }));
  });
}
