import { FutureApiService } from './api.service';

export function main() {
  describe('Future Api Service', () => {
    let serviceUnderTest: FutureApiService;

    beforeEach(() => {
      serviceUnderTest = new FutureApiService(null, null, null, null);
    });

    it('***** HASN\'T BEEN TESTED YET! *****', () => {
      expect(true).toBe(true);
    });
  });
}
