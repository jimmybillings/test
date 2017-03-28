import { QuotesComponent } from './quotes.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quotes Component', () => {
    let componentUnderTest: QuotesComponent, mockQuotesService: any, mockUiConfig: any;

    beforeEach(() => {
      mockQuotesService = {
        data: Observable.of({})
      };
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({}))
      };
      componentUnderTest = new QuotesComponent(null, mockQuotesService, mockUiConfig, null);
    });

    it('has no tests!', () => {
      expect(true).toBe(true);
    });
  });
}
