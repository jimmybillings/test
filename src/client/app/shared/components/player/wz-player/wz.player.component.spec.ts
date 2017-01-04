import {
  // inject,
  TestBed,
  beforeEachProvidersArray
} from '../../../../imports/test.imports';

import { WzPlayerComponent } from './wz.player.component';

export function main() {
  describe('Player Component', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        WzPlayerComponent
      ]
    }));
  });
}
