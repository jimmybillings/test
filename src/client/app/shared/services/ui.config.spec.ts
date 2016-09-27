import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
  TestBed
} from '../../imports/test.imports';

import { UiConfig } from './ui.config';

export function main() {
  describe('UI config', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        UiConfig
      ]
    }));

    it('Should set the api endpoint to get a UI configuration object',
      inject([UiConfig], (service: UiConfig) => {
        expect(service._apiUrls.get).toEqual('api/identities/v1/configuration/site');
      })
    );

    it('Should call the server for the configuration object and send the response to the Redux store for storage',
      inject([UiConfig, MockBackend], (service: UiConfig, mockBackend: MockBackend) => {
        let connection: any;
        mockBackend.connections.subscribe((c: any) => connection = c);
        spyOn(service.store, 'dispatch').and.callThrough();

        service.initialize().subscribe((res:any) => {
          expect(connection.request.url.split('.com')[1]).toBe(
            '/api/identities/v1/configuration/site?siteName=core'
          );
          expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'INITIALIZE', payload: configObj() });
          let config = service.store.select('config');
          config.subscribe((conf) => expect(conf).toEqual(configObj()));
        });

        connection.mockRespond(new Response(
          new ResponseOptions({
            body: configObj()
          })
        ));
      }));


    it('Should return the configuration for a specific component as an argument', inject([UiConfig, MockBackend], (service: UiConfig, mockBackend: MockBackend) => {
      let connection: any;
      mockBackend.connections.subscribe((c: any) => connection = c);

      service.initialize().subscribe((res) => {
        service.get('search').subscribe((data) => {
          expect(data).toEqual(configObj().components.search);
        });
      });

      connection.mockRespond(new Response(
        new ResponseOptions({
          body: configObj()
        })
      ));
    }));
  });

  function configObj() {
    return {
      'components': {
        'search': {},
        'header': {},
        'footer': {},
        'home': {}
      },
      'config': {}
    };
  };
}
