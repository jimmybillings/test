import {
  beforeEachProvidersArray,
  // inject,
  addProviders
} from '../imports/test.imports';

// import { UserManagementComponent } from './user-management.component';

export function main() {
  describe('User Management Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray
      ]);
    });
  });
}
