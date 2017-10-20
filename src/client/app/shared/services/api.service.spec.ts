import { Headers, Response, BaseRequestOptions, RequestMethod, Http, ResponseOptions, ConnectionBackend } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Store } from '@ngrx/store';

import { ApiService } from './api.service';
import { Api, ApiResponse } from '../interfaces/api.interface';
import { ApiConfig } from './api.config';
import { AppStore } from '../../app.store';
import * as ErrorActions from '../../store/error/error.actions';
import * as LoadingIndicatorActions from '../../store/loading-indicator/loading-indicator.actions';

export function main() {
  describe('Api Service', () => {
    let mockApiConfig: any;
    let mockNgrxStore: any;
    let connection: any;
    let loadingShowSpy: jasmine.Spy;
    let loadingHideSpy: jasmine.Spy;

    const mockBackEnd: MockBackend = new MockBackend();
    const successResponse: Response = new Response(new ResponseOptions({ body: '{"status": 200}' }));
    const errorResponse: Object = { status: 401 };
    const errorAction: ErrorActions.Handle = new ErrorActions.Handle({ status: 401 });

    beforeEach(() => {
      mockApiConfig = {
        headers: (token: string = '') => new Headers({ 'Authorization': token === '' ? 'STANDARD TOKEN' : token }),
        baseUrl: 'BASE/',
        portal: 'PORTAL'
      };

      mockBackEnd.connections.subscribe((c: any) => connection = c);

      mockNgrxStore = {
        dispatch: jasmine.createSpy('dispatch')
      };

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
          { provide: Store, useValue: mockNgrxStore }
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

          beforeEach(() => {
            mockHandlers = jasmine.createSpyObj('mockHandlers', ['response', 'error']);
          });

          it('is as expected when the request succeeds', () => {
            let apiResponse: ApiResponse;

            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point').subscribe(
              (response: ApiResponse) => {
                apiResponse = response;
                mockHandlers.response();
              },
              mockHandlers.error
            );

            connection.mockRespond(successResponse);

            expect(apiResponse).toEqual({ status: 200 });
            expect(mockHandlers.response).toHaveBeenCalled();
            expect(mockHandlers.error).not.toHaveBeenCalled();
            expect(mockNgrxStore.dispatch).not.toHaveBeenCalled();
          });

          it('is as expected when the request succeeds with a non-JSON response', () => {
            let apiResponse: ApiResponse;

            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point').subscribe(
              (response: ApiResponse) => {
                apiResponse = response;
                mockHandlers.response();
              },
              mockHandlers.error
            );

            connection.mockRespond('Non-JSON!  Ick!');

            expect(apiResponse).toEqual('Non-JSON!  Ick!');
            expect(mockHandlers.response).toHaveBeenCalled();
            expect(mockHandlers.error).not.toHaveBeenCalled();
            expect(mockNgrxStore.dispatch).not.toHaveBeenCalled();
          });

          it('is as expected when the request errors', () => {
            let apiError: Error;

            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point').subscribe(
              mockHandlers.response,
              (error: Error) => {
                apiError = error;
                mockHandlers.error();
              }
            );

            connection.mockError(errorResponse);

            expect(apiError).toEqual({ status: 401 });
            expect(mockHandlers.response).not.toHaveBeenCalled();
            expect(mockHandlers.error).toHaveBeenCalled();
            expect(mockNgrxStore.dispatch.calls.allArgs()).toEqual([[errorAction]]);
          });
        });

        describe('loading indicator animation', () => {
          const noOp: Function = () => { return; };
          const showAction: LoadingIndicatorActions.Show = new LoadingIndicatorActions.Show();
          const hideAction: LoadingIndicatorActions.Hide = new LoadingIndicatorActions.Hide();

          for (const result of ['succeeds', 'errors']) {
            describe(`when the request ${result}`, () => {
              describe('when loadingIndicator option is not specified', () => {
                it('is not affected', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point').subscribe(() => { }, () => { });

                  if (result === 'succeeds') connection.mockRespond(successResponse); else connection.mockError(errorResponse);

                  expect(mockNgrxStore.dispatch.calls.allArgs().filter((arg: any) => arg[0].type !== '[Error] Handle'))
                    .toEqual([]);
                });
              });

              describe('when loadingIndicator option is false', () => {
                it('is not affected', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loadingIndicator: false })
                    .subscribe(() => { }, () => { });

                  if (result === 'succeeds') connection.mockRespond(successResponse); else connection.mockError(errorResponse);

                  expect(mockNgrxStore.dispatch.calls.allArgs().filter((arg: any) => arg[0].type !== '[Error] Handle'))
                    .toEqual([]);
                });
              });

              describe('when loadingIndicator option is true', () => {
                it('is started with the request and stopped when the response is returned', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loadingIndicator: true })
                    .subscribe(() => { }, () => { });

                  if (result === 'succeeds') connection.mockRespond(successResponse); else connection.mockError(errorResponse);

                  expect(mockNgrxStore.dispatch.calls.allArgs().filter((arg: any) => arg[0].type !== '[Error] Handle'))
                    .toEqual([[showAction], [hideAction]]);
                });
              });

              describe('when loadingIndicator option is onBeforeRequest', () => {
                it('is only started with the request and not turned off when the response is returned', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loadingIndicator: 'onBeforeRequest' })
                    .subscribe(() => { }, () => { });

                  if (result === 'succeeds') connection.mockRespond(successResponse); else connection.mockError(errorResponse);

                  expect(mockNgrxStore.dispatch.calls.allArgs().filter((arg: any) => arg[0].type !== '[Error] Handle'))
                    .toEqual([[showAction]]);
                });
              });

              describe('when loadingIndicator option is offAfterResponse', () => {
                it('is not started with the request but is stopped when the response is returned', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loadingIndicator: 'offAfterResponse' })
                    .subscribe(() => { }, () => { });

                  if (result === 'succeeds') connection.mockRespond(successResponse); else connection.mockError(errorResponse);

                  expect(mockNgrxStore.dispatch.calls.allArgs().filter((arg: any) => arg[0].type !== '[Error] Handle'))
                    .toEqual([[hideAction]]);
                });
              });
            });
          }
        });
      });
    }
  });
}
