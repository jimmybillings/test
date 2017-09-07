import { FutureQuoteShowService } from './quote-show.service';

export function main() {
  describe('Future Quote Show Service', () => {
    let serviceUnderTest: FutureQuoteShowService;

    beforeEach(() => {
      serviceUnderTest = new FutureQuoteShowService(null, null, null, null);
    });

    it('***** HASN\'T BEEN TESTED YET! *****', () => {
      expect(true).toBe(true);
    });
  });
}
