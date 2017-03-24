import { QuoteComponent } from './quote.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quote Component', () => {
    let componentUnderTest: QuoteComponent, mockQuoteService: any;

    beforeEach(() => {
      mockQuoteService = {
        data: Observable.of({})
      };
      componentUnderTest = new QuoteComponent(mockQuoteService);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
