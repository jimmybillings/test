import { QuoteEditTabComponent } from './quote-edit-tab.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quotes Component', () => {
    let componentUnderTest: QuoteEditTabComponent, mockQuotesService: any;

    beforeEach(() => {
      mockQuotesService = {
        data: Observable.of({})
      };
      componentUnderTest = new QuoteEditTabComponent(null, null, null, null, null, null, null, null, null, null, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
