import {
  beforeEachProvidersArray,
  TestBed,
  // inject,
} from '../../imports/test.imports';

// import {ProfileComponent} from './profile.component';

export function main() {
  describe('Profile Component', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
      ]
    }));
  });
}
