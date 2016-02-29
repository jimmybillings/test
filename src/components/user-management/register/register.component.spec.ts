import {
TestComponentBuilder,
describe,
expect,
injectAsync,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {Observable} from 'rxjs/Rx';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {Register} from './register.component';
import {HTTP_PROVIDERS} from 'angular2/http';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import {CurrentUser} from '../../../common/models/current-user.model';
import {Authentication} from '../../../common/services/authentication.data.service';
import {User} from '../../../common/services/user.data.service';
export function main() {
  describe('Register Component', () => {
    
    const res = { 'user': { 'test': 'one' }, token: {token: 'newToken'}};
    
    class MockUser {
      create() {
        return Observable.of(res);
      }
    }
    
    beforeEachProviders(() => [
      Register,
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Register }),
      provide(Router, { useClass: RootRouter }),
      MockBackend,
      HTTP_PROVIDERS,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(User, { useClass: MockUser }),
      ApiConfig,
      CurrentUser,
      Authentication
    ]);

    it('Should have a Register instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Register).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Register).toBeTruthy();
        });
      }));

    it('Should register new user and console log the response for now.', 
      inject([Register], (register) => {
        register.registerForm = {};
        register.registerForm.valid = true;
        spyOn(console, 'log');
        register.onSubmit({ 'firstName': 'first',
                            'lastName': 'second',
                            'emailAddress': 'third',
                            'password': 'fourth',
                            'siteName': register._ApiConfig.getPortal()});
        expect(console.log).toHaveBeenCalled();
    }));
    
    it('Should set up the register form when the component initializes', inject([Register], (register) => {
      spyOn(register, '_setForm');
      register.ngOnInit();
      expect(register._setForm).toHaveBeenCalled();
    }));
    
    it('Should set up the register form object', inject([Register], (register) => {
      register._setForm();
      expect(register.registerForm.value).toEqual(
        { firstName: null, lastName: null, emailAddress: null, password: null, siteName: 'core' });
    }));
  });
}
