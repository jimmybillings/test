import {
  beforeEachProvidersArray,
  addProviders,
  // inject,
} from '../imports/test.imports';

// import { AdminComponent } from './admin.component';

export function main() {
  describe('Admin Component', () => {
    beforeEach(() => {
      addProviders([
      ...beforeEachProvidersArray
    ]);
  });

  });
}
