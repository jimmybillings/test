import {
  beforeEachProvidersArray,
  TestBed
} from '../../imports/test.imports';

import { AssetDataComponent } from './asset-data.component';

export function main() {
  describe('Asset Data Component', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        AssetDataComponent
      ]
    }));
  });
}
