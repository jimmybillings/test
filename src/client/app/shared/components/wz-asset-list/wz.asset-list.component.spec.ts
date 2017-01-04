import {
  beforeEachProvidersArray,
  inject,
  TestBed
} from '../../../imports/test.imports';

import { WzAssetListComponent } from './wz.asset-list.component';

export function main() {
  describe('Asset List Component', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        WzAssetListComponent
      ]
    }));

    it('Should return a shortened version for High Definition, Standard Definition etc...',
      inject([WzAssetListComponent], (service: WzAssetListComponent) => {
        expect(service.formatType('High Definition')).toEqual('hd');
        expect(service.formatType('Standard Definition')).toEqual('sd');
        expect(service.formatType('Digital Video')).toEqual('dv');
        expect(service.formatType('lksjdflkjsdklfj')).toEqual('hd');
      }));

  });
}
