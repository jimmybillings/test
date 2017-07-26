import { QuotesResolver } from './quotes.resolver';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quotes Resolver', () => {
    let resolverUnderTest: QuotesResolver, mockQuotesService: any,
      mockActivatedRoute: any, mockRouterState: any, mockCapabilities: any;

    beforeEach(() => {
      mockQuotesService = {
        getQuotes: jasmine.createSpy('getQuotes').and.returnValue(Observable.of([{ some: 'quote' },
        { another: 'quote' }]))
      };
      mockCapabilities = { administerQuotes: () => false };
      mockActivatedRoute = { params: { s: 'createdOn' } };
      mockRouterState = {};
      resolverUnderTest = new QuotesResolver(mockQuotesService, mockCapabilities);
    });

    describe('resolve()', () => {
      it('should return an observable of some data', () => {
        let result: Observable<any> = resolverUnderTest.resolve(mockActivatedRoute, mockRouterState);
        expect(mockQuotesService.getQuotes).toHaveBeenCalledWith(false, { s: 'createdOn' });

        result.take(1).subscribe(d => {
          expect(d).toEqual([{ some: 'quote' }, { another: 'quote' }]);
        });
      });
    });
  });
}
