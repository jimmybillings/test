import { Headers, Response, BaseRequestOptions, RequestMethod, Http, ResponseOptions, ConnectionBackend } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { ApiService } from './api.service';
import { Api, ApiResponse } from '../interfaces/api.interface';
import { ApiConfig } from './api.config';
import { AppStore } from '../../app.store';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Api Service', () => {
    let mockApiConfig: any;
    let mockStore: MockAppStore;
    let connection: any;
    let loadingShowSpy: jasmine.Spy;
    let loadingHideSpy: jasmine.Spy;

    const mockBackEnd: MockBackend = new MockBackend();
    const successResponse: Response = new Response(new ResponseOptions({ body: '{"status":200}' }));
    const errorResponse: Object = { status: 401 };

    beforeEach(() => {
      mockApiConfig = {
        headers: (token: string = '') => new Headers({ 'Authorization': token === '' ? 'STANDARD TOKEN' : token }),
        baseUrl: 'BASE/',
        portal: 'PORTAL'
      };

      mockBackEnd.connections.subscribe((c: any) => connection = c);

      mockStore = new MockAppStore();
      loadingShowSpy = mockStore.createActionFactoryMethod('loadingIndicator', 'show');
      loadingHideSpy = mockStore.createActionFactoryMethod('loadingIndicator', 'hide');

      TestBed.configureTestingModule({
        providers: [
          ApiService,
          {
            provide: Http,
            useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          MockBackend,
          BaseRequestOptions,
          { provide: ApiConfig, useValue: mockApiConfig },
          { provide: MockBackend, useValue: mockBackEnd },
          { provide: AppStore, useValue: mockStore }
        ]
      });
    });

    for (const methodName of ['get', 'post', 'put', 'delete']) {
      describe(`${methodName}()`, () => {
        let serviceUnderTest: ApiService;
        let methodUnderTest: Function;
        let expectedHttpMethod: RequestMethod;

        const getMethodInfoFrom: Function = (methodName: string) => {
          switch (methodName) {
            case 'get': return [serviceUnderTest.get, RequestMethod.Get];
            case 'post': return [serviceUnderTest.post, RequestMethod.Post];
            case 'put': return [serviceUnderTest.put, RequestMethod.Put];
            case 'delete': return [serviceUnderTest.delete, RequestMethod.Delete];
            default: return [undefined, undefined];
          }
        };

        beforeEach(inject([ApiService], (apiService: ApiService) => {
          serviceUnderTest = apiService;
          [methodUnderTest, expectedHttpMethod] = getMethodInfoFrom(methodName);
        }));

        it('calls the correct HTTP method', () => {
          methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
            .subscribe(() => expect(connection.request.method).toEqual(expectedHttpMethod));
        });

        describe('URL', () => {
          afterEach(() => connection.mockRespond(successResponse));

          it('is correct for all backend APIs', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point?siteName=PORTAL'));

            methodUnderTest.call(serviceUnderTest, Api.Assets, 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/assets-api/v1/end/point?siteName=PORTAL'));

            methodUnderTest.call(serviceUnderTest, Api.Orders, 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/orders-api/v1/end/point?siteName=PORTAL'));
          });

          it('is unusable when an undefined backend API is specified', () => {
            methodUnderTest.call(serviceUnderTest, (10836 as Api), 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/?-api/v?/end/point&siteName=PORTAL'));
          });

          it('is correct with no options', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point?siteName=PORTAL'));
          });

          it('is correct with parameters', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { parameters: { a: 'b', c: 'd' } })
              .subscribe(() => expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point?a=b&c=d&siteName=PORTAL'));
          });

          it('is disregarding the siteName key on the parameters if passed in from outside the ApiService', () => {
            methodUnderTest.call(
              serviceUnderTest, Api.Identities, 'end/point', { parameters: { a: 'b', c: 'd', siteName: 'TEST' } })
              .subscribe(() => {
                expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point?a=b&c=d&siteName=PORTAL');
              });
          });
        });

        describe('headers', () => {
          afterEach(() => connection.mockRespond(successResponse));

          it('is correct with no options', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
              .subscribe(() => expect(connection.request.headers.get('Authorization')).toEqual('STANDARD TOKEN'));
          });

          it('is correct with override token', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { overridingToken: 'OVERRIDING TOKEN' })
              .subscribe(() => expect(connection.request.headers.get('Authorization')).toEqual('OVERRIDING TOKEN'));
          });
        });

        describe('body', () => {
          afterEach(() => connection.mockRespond(successResponse));
          it('is just the site name when no body option is specified', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
              .subscribe(() => expect(connection.request._body).toEqual('{"siteName":"PORTAL"}'));
          });

          it('is the specified body plus the site name', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { body: { a: 'b' } })
              .subscribe(() => expect(connection.request._body).toEqual('{"a":"b","siteName":"PORTAL"}'));
          });
        });

        describe('result', () => {
          let mockHandlers: any;
          let errorSpy: jasmine.Spy;

          beforeEach(() => {
            mockHandlers = jasmine.createSpyObj('mockHandlers', ['response', 'error']);
            errorSpy = mockStore.createActionFactoryMethod('error', 'handle');
          });

          it('is as expected when the request succeeds', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point').subscribe(
              (response: ApiResponse) => {
                expect(response).toEqual({ status: 200 });
                mockHandlers.response();
              },
              mockHandlers.error,
              () => {
                expect(mockHandlers.response).toHaveBeenCalled();
                expect(mockHandlers.error).not.toHaveBeenCalled();
                expect(errorSpy).not.toHaveBeenCalled();
              });
            connection.mockRespond(successResponse);
          });

          it('is as expected when the request succeeds with a non-JSON response', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point').subscribe(
              (response: ApiResponse) => {
                expect(response).toEqual('Non-JSON!  Ick!');
                mockHandlers.response();
              },
              mockHandlers.error,
              () => {
                expect(mockHandlers.response).toHaveBeenCalled();
                expect(mockHandlers.error).not.toHaveBeenCalled();
                expect(errorSpy).not.toHaveBeenCalled();
              });
            connection.mockRespond('Non-JSON!  Ick!');
          });

          it('is as expected when the request errors', () => {
            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point').subscribe(
              mockHandlers.response,
              (error: Error) => {
                expect(error).toEqual({ status: 401 });
                mockHandlers.error();
              },
              () => {
                expect(mockHandlers.response).not.toHaveBeenCalled();
                expect(mockHandlers.error).toHaveBeenCalled();
                mockStore.expectDispatchFor(errorSpy, { status: 401 });
              }
            );
            connection.mockError(errorResponse);
          });
        });

        describe('loadingIndicator animation', () => {
          let noOp: Function = () => { return; };

          for (const result of ['succeeds', 'errors']) {
            describe(`when the request ${result}`, () => {
              afterEach(() => {
                if (result === 'succeeds') connection.mockRespond(successResponse); else connection.mockError(errorResponse);
              });

              describe('when loadingIndicator option is not specified', () => {
                it('is not affected', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
                    .subscribe(noOp, noOp, () => {
                      mockStore.expectNoDispatchFor(loadingHideSpy);
                      mockStore.expectNoDispatchFor(loadingShowSpy);
                    });
                });
              });

              describe('when loadingIndicator option is false', () => {
                it('is not affected', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loadingIndicator: false })
                    .subscribe(noOp, noOp, () => {
                      mockStore.expectNoDispatchFor(loadingHideSpy);
                      mockStore.expectNoDispatchFor(loadingShowSpy);
                    });
                });
              });

              describe('when loadingIndicator option is true', () => {
                it('is started with the request and stopped when the response is returned', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loadingIndicator: true })
                    .subscribe(noOp, noOp, () => {
                      mockStore.expectDispatchFor(loadingShowSpy);
                      mockStore.expectDispatchFor(loadingHideSpy);
                    });
                });
              });

              describe('when loadingIndicator option is onBeforeRequest', () => {
                it('is only started with the request and not turned off when the response is returned', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loadingIndicator: 'onBeforeRequest' })
                    .subscribe(noOp, noOp, () => mockStore.expectDispatchFor(loadingShowSpy));
                });
              });

              describe('when loadingIndicator option is offAfterResponse', () => {
                it('is not started with the request but is stopped when the response is returned', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loadingIndicator: 'offAfterResponse' })
                    .subscribe(noOp, noOp, () => mockStore.expectDispatchFor(loadingHideSpy));
                });
              });
            });
          }
        });
      });
    }
  });
}
