import {
  beforeEachProvidersArray,
  TestBed,
} from '../imports/test.imports';

// import { AdminComponent } from './admin.component';

export function main() {
  describe('Admin Component', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray
      ]
    }));

  });
}
