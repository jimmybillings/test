import {
  beforeEachProvidersArray,
  TestComponentBuilder,
  inject,
  addProviders
} from '../../imports/test.imports';

import { AssetDataComponent} from './asset-data.component';

export function main() {
  describe('Asset Data Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        AssetDataComponent,
      ]);
    });

    it('Create instance of AssetDataComponent',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(AssetDataComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AssetDataComponent).toBeTruthy();
        });
      }));
  });
}
