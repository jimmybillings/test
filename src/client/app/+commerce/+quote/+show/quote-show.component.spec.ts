import { QuoteShowComponent } from './quote-show.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quote Show Component', () => {
    let componentUnderTest: QuoteShowComponent, mockQuoteService: any;

    beforeEach(() => {
      mockQuoteService = {
        data: Observable.of({})
      };
      componentUnderTest = new QuoteShowComponent(null, mockQuoteService);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
