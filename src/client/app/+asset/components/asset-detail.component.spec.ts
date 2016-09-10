import {
  beforeEachProvidersArray,
  // inject,
  TestBed
} from '../../imports/test.imports';

import { AssetDetailComponent} from './asset-detail.component';

export function main() {
  describe('Asset Detail Component', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        AssetDetailComponent
      ]
    }));

  });
}
