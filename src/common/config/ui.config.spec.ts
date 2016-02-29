import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { provide } from 'angular2/core';
import { UiConfig } from './ui.config';
import { ApiConfig } from './api.config';
import { BaseRequestOptions, Http, Response, ResponseOptions} from 'angular2/http';
import { MockBackend } from 'angular2/http/testing';

export function main() {
  describe('UI config', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      UiConfig,
      ApiConfig
    ]);

    it('Should set up the api endpoint to get a sites UI config object and setup an empty config object',
      inject([UiConfig], (service) => {
        expect(service._apiUrls.get).toEqual(service._apiConfig.getApiRoot() + 'api/identities/configuration/site?siteName=');
        expect(service._config).toEqual({});
      })
    );
    
    it('Should make a request to the server for the UI config and store it in this._config', 
      inject([UiConfig, MockBackend], (service, mockBackend) => {
      let connection;
      mockBackend.connections.subscribe(c => connection = c);
      let site = 'core';
      service.get(site).subscribe((res) => {
        expect(connection.request.url).toBe(
          service._apiConfig.getApiRoot() + 'api/identities/configuration/site?siteName='+site
        );
        // expect(service.set).toHaveBeenCalledWith(configObj());
        expect(service._config).toEqual(configObj());
      });
      connection.mockRespond(new Response(
        new ResponseOptions({
          body: configObj()
        })
      ));
    }));
    
    it('Should set a UI config object', inject([UiConfig], (service) => {
      service.set(configObj());
      expect(service._config).toEqual(configObj());
    }));
    
    it('Should get a UI config object', inject([UiConfig], (service) => {
      service.set(configObj());
      expect(service.ui()).toEqual(configObj());
    }));
    
    
  });
  
 function configObj() {
    return {
      'search': {},
      'home': {},
      'header': {},
      'footer': {}
    };
  };
}
