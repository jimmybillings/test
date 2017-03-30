import { QuoteEditComponent } from './quote-edit.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quotes Component', () => {
    let componentUnderTest: QuoteEditComponent, mockQuotesService: any;

    beforeEach(() => {
      mockQuotesService = {
        data: Observable.of({})
      };
      componentUnderTest = new QuoteEditComponent(mockQuotesService);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
