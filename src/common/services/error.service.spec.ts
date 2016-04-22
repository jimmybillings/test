import { it, describe, expect, beforeEachProviders, inject } from 'angular2/testing';
import { Error } from './error.service';
import { Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, Location } from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {provide} from 'angular2/core';

export function main() {
  describe('Error Service', () => {

    beforeEachProviders(() => [
      Error,
      RouteRegistry,
      provide(Router, {useClass: RootRouter}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: Error}),
      provide(Location, {useClass: SpyLocation})
    ]);
    
    it('Should rediect to the login page on a 401 response', inject([Error], (service) => {
      let error = { status: 401};
      spyOn(service.router, 'navigate');
      service.handle(error); 
      expect(service.router.navigate).toHaveBeenCalledWith(['UserManagement/Login']);
    }));
    
  });

  
}
