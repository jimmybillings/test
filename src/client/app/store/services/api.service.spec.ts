import { FutureApiService } from './api.service';

export function main() {
  xdescribe('Future Api Service', () => {
    let serviceUnderTest: FutureApiService;

    beforeEach(() => {
      serviceUnderTest = new FutureApiService(null, null, null, null);
    });

    xit('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
