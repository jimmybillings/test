import { QuoteTabComponent } from './quote-tab.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quote Tab Component', () => {
    let componentUnderTest: QuoteTabComponent, mockQuoteService: any;

    beforeEach(() => {
      mockQuoteService = { data: Observable.of({}) };
      componentUnderTest = new QuoteTabComponent(mockQuoteService, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
