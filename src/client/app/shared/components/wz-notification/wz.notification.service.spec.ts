import { Observable } from 'rxjs/Rx';

import { WzNotificationService } from './wz.notification.service';

export function main() {
  describe('Wz Notification Service', () => {
    let serviceUnderTest: WzNotificationService;
    let mockUiConfig: any;

    beforeEach(() => {
      // TODO: This is a minimal mock that exists solely to stop
      // the constructor from failing.  Enhance as needed.
      mockUiConfig = { get: () => Observable.of({}) };

      serviceUnderTest = new WzNotificationService(null, null, null, mockUiConfig);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

