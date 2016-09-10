import {
  beforeEachProvidersArray,
  // inject,
  TestBed
} from '../../imports/test.imports';

// import { BinTrayComponent } from './collection-tray.component';

export function main() {
  describe('Bin Tray Component', () => {
     beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
      ]
    }));
  });
}
