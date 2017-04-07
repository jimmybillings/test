import { QuotesResolver } from './quotes.resolver';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quotes Resolver', () => {
    let resolverUnderTest: QuotesResolver, mockQuotesService: any, mockActivatedRoute: any, mockRouterState: any;

    beforeEach(() => {
      mockQuotesService = {
        getQuotes: jasmine.createSpy('getQuotes').and.returnValue(Observable.of([{ some: 'quote' }, { another: 'quote' }]))
      };
      mockActivatedRoute = { params: { s: 'createdOn' } };
      mockRouterState = {};
      resolverUnderTest = new QuotesResolver(mockQuotesService);
    });

    describe('resolve()', () => {
      it('should return an observable of some data', () => {
        let result: Observable<any> = resolverUnderTest.resolve(mockActivatedRoute, mockRouterState);
        expect(mockQuotesService.getQuotes).toHaveBeenCalledWith({ s: 'createdOn' });

        result.take(1).subscribe(d => {
          expect(d).toEqual([{ some: 'quote' }, { another: 'quote' }]);
        });
      });
    });
  });
}
