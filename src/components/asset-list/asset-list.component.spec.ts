import {
TestComponentBuilder,
describe,
expect,
inject,
it,
beforeEachProviders
} from 'angular2/testing';

import {AssetList} from './asset-list.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';

export function main() {
  describe('Asset List Component', () => {
    beforeEachProviders(() => [
      AssetList,
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: AssetList }),
      provide(Router, { useClass: RootRouter }),
    ]);

    it('Create instance of AssetList',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(AssetList).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetList).toBeTruthy();
        });
      }));
     
    it('Should return a shortened version for High Definition, Standard Definition etc...', inject([AssetList], (service) => {
      expect(service.formatType('High Definition')).toEqual('hd');
      expect(service.formatType('Standard Definition')).toEqual('sd');
      expect(service.formatType('Digital Video')).toEqual('dv');
      expect(service.formatType('lksjdflkjsdklfj')).toEqual('hd');
    }));
    
    it('Should fire an event to show an asset when clicked', inject([AssetList], (service) => {
      spyOn(service.onShowAsset, 'emit');
      service.showAsset('12345');
      expect(service.onShowAsset.emit).toHaveBeenCalledWith('12345');
    }));
  });
}
