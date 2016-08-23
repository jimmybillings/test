import {
  beforeEachProvidersArray,
  addProviders,
  // inject,
} from '../../imports/test.imports';

import { DashboardComponent} from './dashboard.component';

export function main() {
  describe('Admin Dashboard component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        DashboardComponent
      ]);
    });

  });
}
