import { QuotesComponent } from './quotes.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quotes Component', () => {
    let componentUnderTest: QuotesComponent, mockQuotesService: any;

    beforeEach(() => {
      mockQuotesService = {
        data: Observable.of({})
      };
      componentUnderTest = new QuotesComponent(mockQuotesService);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
