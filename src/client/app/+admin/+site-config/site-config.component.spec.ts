import {
  beforeEachProvidersArray,
  addProviders,
  // inject,
} from '../../imports/test.imports';

import { SiteConfigComponent } from './site-config.component';

export function main() {
  describe('Admin Site Config Component', () => {
    class MockActivatedRoute {}
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        SiteConfigComponent,
      ]);
    });
  });
}
