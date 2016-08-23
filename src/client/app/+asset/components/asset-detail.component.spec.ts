import {
  beforeEachProvidersArray,
  // inject,
  addProviders
} from '../../imports/test.imports';

import { AssetDetailComponent} from './asset-detail.component';

export function main() {
  describe('Asset Detail Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        AssetDetailComponent
      ]);
    });

  });
}
