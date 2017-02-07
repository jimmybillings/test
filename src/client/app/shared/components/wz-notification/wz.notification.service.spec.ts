import { Observable } from 'rxjs/Rx';

import { WzNotificationService } from './wz.notification.service';

export function main() {
  describe('Wz Notification Service', () => {
    let serviceUnderTest: WzNotificationService;
    let mockErrorStore: any;
    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockErrorStore = { data: Observable.of({}) };
      serviceUnderTest = new WzNotificationService(null, null, mockErrorStore, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

