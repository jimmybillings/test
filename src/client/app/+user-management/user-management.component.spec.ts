import {
  beforeEachProvidersArray,
  // inject,
  TestBed
} from '../imports/test.imports';

// import { UserManagementComponent } from './user-management.component';

export function main() {
  describe('User Management Component', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
      ]
    }));
  });


}
