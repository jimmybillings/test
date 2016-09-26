import {
  beforeEachProvidersArray,
  // inject,
  TestBed
} from '../../imports/test.imports';

// import { CollectionTrayComponent } from './collection-tray.component';

export function main() {
  describe('Collection Tray Component', () => {
     beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
      ]
    }));
  });
}
