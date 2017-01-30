import {
  beforeEachProvidersArray,
  inject,
  TestBed
} from '../../../../imports/test.imports';

import { WzAssetGridComponent } from './wz.asset-grid.component';

export function main() {
  describe('Asset List Component', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        WzAssetGridComponent
      ]
    }));

    it('Should return a shortened version for High Definition, Standard Definition etc...',
      inject([WzAssetGridComponent], (service: WzAssetGridComponent) => {
        expect(service.formatType('High Definition')).toEqual('hd');
        expect(service.formatType('Standard Definition')).toEqual('sd');
        expect(service.formatType('Digital Video')).toEqual('dv');
        expect(service.formatType('lksjdflkjsdklfj')).toEqual('hd');
      }));

  });
}
