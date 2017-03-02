import {
  inject,
  beforeEachProvidersArray,
  TestBed,
  MockBackend,
  Headers,
  Response,
  RequestMethod,
  ResponseOptions
} from '../../imports/test.imports';

import { ApiService } from './api.service';
import { Api, ApiResponse } from '../interfaces/api.interface';
import { ApiConfig } from './api.config';
import { UiState } from './ui.state';
import { ErrorStore } from '../stores/error.store';
import { CurrentUserService } from './current-user.service';

export function main() {
  describe('Api Service', () => {
    let mockApiConfig: any;
    let mockUiState: any;
    let mockErrorService: any;
    let mockCurrentUserService: any;
    let connection: any;
    let loggedIn: boolean = true;

    const mockBackEnd: MockBackend = new MockBackend();
    const successResponse: Response = new Response(new ResponseOptions({ body: '{"status":200}' }));
    const errorResponse: Object = { status: 401 };

    beforeEach(() => {
      mockApiConfig = {
        headers: (token: string = '') => new Headers({ 'Authorization': token === '' ? 'STANDARD TOKEN' : token }),
        baseUrl: () => 'BASE/',
        getPortal: () => 'PORTAL'
      };

      mockUiState = jasmine.createSpyObj('mockUiState', ['loading']);
      mockErrorService = jasmine.createSpyObj('mockErrorService', ['dispatch']);
      mockCurrentUserService = { loggedIn: () => loggedIn };

      mockBackEnd.connections.subscribe((c: any) => connection = c);

      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          ApiService,
          { provide: ApiConfig, useValue: mockApiConfig },
          { provide: ErrorStore, useValue: mockErrorService },
          { provide: MockBackend, useValue: mockBackEnd },
          { provide: CurrentUserService, useValue: mockCurrentUserService },
          { provide: UiState, useValue: mockUiState }
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
            loggedIn = true;

            methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point'));

            methodUnderTest.call(serviceUnderTest, Api.Assets, 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/assets-api/v1/end/point'));

            methodUnderTest.call(serviceUnderTest, Api.Orders, 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/orders-api/v1/end/point'));
          });

          it('is unusable when an undefined backend API is specified', () => {
            loggedIn = true;

            methodUnderTest.call(serviceUnderTest, (10836 as Api), 'end/point')
              .subscribe(() => expect(connection.request.url).toEqual('BASE/?-api/v?/end/point'));
          });

          describe('when logged in', () => {
            beforeEach(() => loggedIn = true);

            it('is correct with no options', () => {
              methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
                .subscribe(() => expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point'));
            });

            it('is correct with parameters', () => {
              methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { parameters: { a: 'b', c: 'd' } })
                .subscribe(() => expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point?a=b&c=d'));
            });
          });

          describe('when logged out', () => {
            beforeEach(() => loggedIn = false);

            it('is correct with no options', () => {
              methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
                .subscribe(() => expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point?siteName=PORTAL'));
            });

            it('is correct with parameters', () => {
              methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { parameters: { a: 'b', c: 'd' } })
                .subscribe(() => expect(connection.request.url).toEqual('BASE/identities-api/v1/end/point?a=b&c=d&siteName=PORTAL'));
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

          describe('when logged in', () => {
            beforeEach(() => loggedIn = true);

            it('is empty when no body option is specified', () => {
              methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
                .subscribe(() => expect(connection.request._body).toEqual('{}'));
            });

            it('is the specified body option', () => {
              methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { body: { a: 'b' } })
                .subscribe(() => expect(connection.request._body).toEqual('{"a":"b"}'));
            });
          });

          describe('when logged out', () => {
            beforeEach(() => loggedIn = false);

            it('is just the site name when no body option is specified', () => {
              methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
                .subscribe(() => expect(connection.request._body).toEqual('{"siteName":"PORTAL"}'));
            });

            it('is the specified body plus the site name', () => {
              methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { body: { a: 'b' } })
                .subscribe(() => expect(connection.request._body).toEqual('{"a":"b","siteName":"PORTAL"}'));
            });
          });
        });

        describe('result', () => {
          let mockHandlers: any;
          beforeEach(() => mockHandlers = jasmine.createSpyObj('mockHandlers', ['response', 'error']));

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
                expect(mockErrorService.dispatch).not.toHaveBeenCalled();
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
                expect(mockErrorService.dispatch).not.toHaveBeenCalled();
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
                expect(mockErrorService.dispatch).toHaveBeenCalledWith({ status: 401 });
              }
            );
            connection.mockError(errorResponse);
          });
        });

        describe('loading animation', () => {
          let noOp: Function = () => { return; };

          for (const result of ['succeeds', 'errors']) {
            describe(`when the request ${result}`, () => {
              afterEach(() => {
                if (result === 'succeeds') connection.mockRespond(successResponse); else connection.mockError(errorResponse);
              });

              describe('when loading option is not specified', () => {
                it('is not affected', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point')
                    .subscribe(noOp, noOp, () => expect(mockUiState.loading).not.toHaveBeenCalled());
                });
              });

              describe('when loading option is false', () => {
                it('is not affected', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loading: false })
                    .subscribe(noOp, noOp, () => expect(mockUiState.loading).not.toHaveBeenCalled());
                });
              });

              describe('when loading option is true', () => {
                it('is started at first and stopped when the call is complete', () => {
                  methodUnderTest.call(serviceUnderTest, Api.Identities, 'end/point', { loading: true })
                    .subscribe(noOp, noOp, () => expect(mockUiState.loading.calls.allArgs()).toEqual([[true], [false]]));
                });
              });
            });
          }
        });
      });
    }
  });
}
