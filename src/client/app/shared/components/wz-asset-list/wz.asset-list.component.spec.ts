import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it
} from '../../../imports/test.imports';

import { WzAssetListComponent} from './wz.asset-list.component';

export function main() {
  describe('Asset List Component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      WzAssetListComponent
    ]);

    it('Create instance of AssetList',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzAssetListComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzAssetListComponent).toBeTruthy();
        });
      }));

    it('Should return a shortened version for High Definition, Standard Definition etc...', inject([WzAssetListComponent], (service: WzAssetListComponent) => {
      expect(service.formatType('High Definition')).toEqual('hd');
      expect(service.formatType('Standard Definition')).toEqual('sd');
      expect(service.formatType('Digital Video')).toEqual('dv');
      expect(service.formatType('lksjdflkjsdklfj')).toEqual('hd');
    }));

    it('Should fire an event to show an asset when clicked', inject([WzAssetListComponent], (service: WzAssetListComponent) => {
      spyOn(service.onShowAsset, 'emit');
      service.showAsset('12345');
      expect(service.onShowAsset.emit).toHaveBeenCalledWith('12345');
    }));
  });
}
