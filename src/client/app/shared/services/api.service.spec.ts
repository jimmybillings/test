import {
  inject,
  beforeEachProvidersArray,
  TestBed,
  MockBackend
} from '../../imports/test.imports';

import { ApiService } from './api.service';
import { ApiConfig } from './api.config';

export function main() {


  describe('Api Service', () => {
    let connection: any, MockApiConfig: any;

    beforeEach(() => {
      MockApiConfig = { userHeaders: function () { return 'hi'; }, baseUrl: function () { return 'lskdfj'; } };
      spyOn(MockApiConfig, 'userHeaders').and.callThrough();
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          ApiService,
          { provide: ApiConfig, useValue: MockApiConfig }
        ]
      });
    });

    it('Should create an instance of authorization headers, with correct header info',
      inject([ApiService, MockBackend], (service: ApiService, mockBackEnd: MockBackend) => {

        mockBackEnd.connections.subscribe((c: any) => connection = c);
        service.get('api/collection/1').subscribe((res) => {
          expect(res).toEqual({ status: 403 });
          expect(MockApiConfig.userHeaders).toHaveBeenCalled();
        });

        connection.mockRespond({ status: 403 });
      }));
  });
}
