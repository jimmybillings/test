import { QuoteComponent } from './quote-show.component';
import { Observable } from 'rxjs/Observable';

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
