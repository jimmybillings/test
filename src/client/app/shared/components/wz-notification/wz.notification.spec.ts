import {
  beforeEachProvidersArray,
  // inject,
  TestBed
} from '../../../imports/test.imports';

import { WzNotificationComponent } from './wz.notification.component';

export function main() {
  describe('Notification Component', () => {

     beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        WzNotificationComponent
      ]
    }));

  });
}
