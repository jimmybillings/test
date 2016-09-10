import {
  beforeEachProvidersArray,
  TestBed,
  // inject,
} from '../../imports/test.imports';

import { DashboardComponent} from './dashboard.component';

export function main() {
  describe('Admin Dashboard component', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        DashboardComponent
      ]
    }));



  });
}
