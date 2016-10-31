import { AppEventService } from './app-event.service';

export function main() {
  describe('App Event Service', () => {
    let serviceUnderTest: AppEventService;

    beforeEach(() => {
      serviceUnderTest = new AppEventService();
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
};

