import {
  beforeEachProvidersArray,
  // inject,
  addProviders
} from '../../imports/test.imports';

// import { BinTrayComponent } from './bin-tray.component';

export function main() {
  describe('Bin Tray Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray
      ]);
    });
  });
}
