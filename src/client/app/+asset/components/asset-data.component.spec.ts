import {
  beforeEachProvidersArray,
  // inject,
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
  });
}
