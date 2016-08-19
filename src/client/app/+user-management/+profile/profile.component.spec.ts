import {
  beforeEachProvidersArray,
  addProviders,
  // inject,
} from '../../imports/test.imports';

// import {ProfileComponent} from './profile.component';

export function main() {
  describe('Profile Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray
      ]);
    });
  });
}
