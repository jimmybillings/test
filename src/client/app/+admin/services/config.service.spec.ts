import {
  beforeEachProvidersArray,
  beforeEachProviders,
  ResponseOptions,
  RequestMethod,
  MockBackend,
  Response,
  describe,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { ConfigService } from './config.service';

export function main() {
  describe('Config Service', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray
    ]);

    beforeEach(() => {
      this.uiApiUrl = 'https://crxextapi.dev.wzplatform.com/api/identities/v1/configuration/site/';
      this.siteApiUrl = 'https://crxextapi.dev.wzplatform.com/api/identities/v1/site/';
    });

    it('Should create instance variables for http, and apiConfig',
      inject([ConfigService, MockBackend], (service: ConfigService, mockBackend: MockBackend) => {
        expect(service.http).toBeDefined();
        expect(service.apiConfig).toBeDefined();
      }));

    it('Should have a getUi method that returns all of the UI config objects',
      inject([ConfigService, MockBackend], (service: ConfigService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.getUiConfigIndex().subscribe(response => {
          expect(connection.request.url).toEqual(this.uiApiUrl + 'search');
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(response).toEqual(mockResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockResponse()
          })
        ));
      }));

    it('Should have a getSite method that returns all of the Site config objects',
      inject([ConfigService, MockBackend], (service: ConfigService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.getSiteConfigIndex().subscribe(response => {
          expect(connection.request.url).toEqual(this.siteApiUrl + 'search');
          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(response).toEqual(mockResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockResponse()
          })
        ));
      }));

    it('Should have a search method that searches for Site config objects',
      inject([ConfigService, MockBackend], (service: ConfigService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.searchSiteConfig('core').subscribe(response => {
          expect(connection.request.url).toEqual(this.siteApiUrl + 'search/?q=core');
          expect(connection.request.method).toBe(RequestMethod.Get);
        });
      }));

    it('Should have a getSiteConfig method that gets a Site config object by id',
      inject([ConfigService, MockBackend], (service: ConfigService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.showSiteConfig(1).subscribe(response => {
          expect(connection.request.url).toEqual(this.siteApiUrl + '1');
          expect(connection.request.method).toBe(RequestMethod.Get);
        });
      }));

    it('Should have a getUiConfig method that gets a UI config object by siteName',
      inject([ConfigService, MockBackend], (service: ConfigService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.showUiConfig('core').subscribe(response => {
          expect(connection.request.url).toEqual(this.uiApiUrl + '?siteName=core');
          expect(connection.request.method).toBe(RequestMethod.Get);
        });
      }));

    function mockResponse() {
      return {
        'items': [{
          'lastUpdated': '2016-06-20T15:14:12Z',
          'createdOn': '2016-03-02T17:01:14Z',
          'id': 2,
          'siteName': 'cnn',
          'components': {
            'header': { 'config': { 'title': { 'value': 'CNN Image Source' } } },
            'searchBox': { 'config': { 'pageSize': { 'value': '56' } } },
            'search': { 'config': { 'viewType': { 'value': 'grid' } } },
            'home': { 'config': { 'pageSize': { 'value': '56' } } }
          },
          'config': {}
        }],
        'totalCount': 1, 'currentPage': 0, 'pageSize': 20, 'hasNextPage': false, 'hasPreviousPage': false, 'numberOfPages': 1
      };
    }
  });
}
