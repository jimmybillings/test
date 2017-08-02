import { QuoteResolver } from './quote.resolver';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Resolver', () => {
    let resolverUnderTest: QuoteResolver, mockQuoteService: any,
      mockActivatedRoute: any, mockRouterState: any, mockCommerceCapabliites: any;

    beforeEach(() => {
      mockQuoteService = {
        load: jasmine.createSpy('load').and.returnValue(Observable.of({ some: 'quote' }))
      };
      mockActivatedRoute = {
        url: '', params: { quoteId: '2' }
      };
      mockCommerceCapabliites = {
        administerQuotes: jasmine.createSpy('administerQuotes').and.returnValue(true)
      };
      mockRouterState = {};
      resolverUnderTest = new QuoteResolver(mockQuoteService, mockCommerceCapabliites);
    });

    describe('resolve', () => {
      it('should return an observable of some data', () => {
        let result: Observable<any> = resolverUnderTest.resolve(mockActivatedRoute, mockRouterState);
        expect(mockQuoteService.load).toHaveBeenCalledWith(2, true);
        result.take(1).subscribe(d => {
          expect(d).toEqual({ some: 'quote' });
        });
      });
    });
  });
}
