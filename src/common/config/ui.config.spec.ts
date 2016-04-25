import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { UiConfig, config } from './ui.config';
import { ApiConfig } from './api.config';
import { BaseRequestOptions, Http, Response, ResponseOptions} from 'angular2/http';
import { MockBackend } from 'angular2/http/testing';
import { provideStore } from '@ngrx/store';

export function main() {
  describe('UI config', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({config: config}),
      UiConfig,
      ApiConfig
    ]);

    it('Should set the api endpoint to get a UI configuration object',
      inject([UiConfig], (service) => {
        expect(service._apiUrls.get).toEqual(service._apiConfig.baseUrl() + 'api/identities/v1/configuration/site?siteName=');
      })
    );
    
    it('Should call the server for the configuration object and send the response to the Redux store for storage', 
      inject([UiConfig, MockBackend], (service, mockBackend) => {
      let connection;
      let site = 'core';
      mockBackend.connections.subscribe(c => connection = c);
      spyOn(service.store, 'dispatch').and.callThrough();
      
      service.initialize(site).subscribe((res) => {
        expect(connection.request.url).toBe(
          service._apiConfig.baseUrl() + 'api/identities/v1/configuration/site?siteName='+site
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
    
    
    it('Should return the configuration for a specific component as an argument', inject([UiConfig, MockBackend], (service, mockBackend) => {
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      let site = 'core';
      
      service.initialize(site).subscribe((res) => {
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
