import { QuoteResolver } from './quote.resolver';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quote Resolver', () => {
    let resolverUnderTest: QuoteResolver, mockQuoteService: any, mockActivatedRoute: any, mockRouterState: any;

    beforeEach(() => {
      mockQuoteService = {
        getQuote: jasmine.createSpy('getQuote').and.returnValue(Observable.of({ some: 'quote' }))
      };
      mockActivatedRoute = {
        url: '', params: { quoteId: '2' }
      };
      mockRouterState = {};
      resolverUnderTest = new QuoteResolver(mockQuoteService);
    });

    describe('resolve', () => {
      it('should return an observable of some data', () => {
        let result: Observable<any> = resolverUnderTest.resolve(mockActivatedRoute, mockRouterState);
        expect(mockQuoteService.getQuote).toHaveBeenCalled();
        result.take(1).subscribe(d => {
          expect(d).toEqual({ some: 'quote' });
        });
      });
    });
  });
}
