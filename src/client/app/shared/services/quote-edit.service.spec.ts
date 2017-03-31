import { QuoteEditService } from './quote-edit.service';

export function main() {
  describe('Some Class', () => {
    let serviceUnderTest: QuoteEditService;

    beforeEach(() => {
      serviceUnderTest = new QuoteEditService(null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
