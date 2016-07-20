import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  beforeEachProviders,
  describe,
  inject,
  expect,
  it
} from '../../imports/test.imports';

import { AssetDetailComponent} from './asset-detail.component';

export function main() {
  describe('Asset Detail Component', () => {
    beforeEachProviders(() => [
      ...beforeEachProvidersArray,
      AssetDetailComponent
    ]);

    it('Create instance of AssetDetail',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AssetDetailComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetDetailComponent).toBeTruthy();
        });
      }));
  });
}