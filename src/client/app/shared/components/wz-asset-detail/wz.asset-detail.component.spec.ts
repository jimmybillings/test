import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it,
} from '../../../imports/test.imports';

import { WzAssetDetailComponent} from './wz.asset-detail.component';

export function main() {
  describe('Asset Detail Component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      WzAssetDetailComponent
    ]);

    it('Create instance of AssetDetail',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(WzAssetDetailComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof WzAssetDetailComponent).toBeTruthy();
        });
      }));
  });
}
