import {
  beforeEachProvidersArray,
  // inject,
  addProviders
} from '../../../imports/test.imports';

import { WzNotificationComponent } from './wz.notification.component';

export function main() {
  describe('Notification Component', () => {
    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        WzNotificationComponent
      ]);
    });

  });
}
