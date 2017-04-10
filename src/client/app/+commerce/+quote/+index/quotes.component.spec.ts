import { QuotesComponent } from './quotes.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Quotes Component', () => {
    let componentUnderTest: QuotesComponent, mockQuotesService: any, mockUiConfig: any,
      mockUserCapabilities: any, mockRouter: any, hasPermission: boolean;

    beforeEach(() => {
      hasPermission = false;
      mockUserCapabilities = { administerQuotes: jasmine.createSpy('administerQuotes').and.returnValue(hasPermission) };
      mockQuotesService = {
        data: Observable.of({}),
        getQuotes: jasmine.createSpy('getQuotes').and.returnValue(Observable.of({})),
        setFocused: jasmine.createSpy('setFocused').and.returnValue(Observable.of({}))
      };
      mockUiConfig = { get: jasmine.createSpy('get').and.returnValue(Observable.of({})) };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      componentUnderTest = new QuotesComponent(mockUserCapabilities, mockQuotesService, mockUiConfig, mockRouter);
    });

    describe('changePage()', () => {
      it('should call navigate on the router with the proper params', () => {
        componentUnderTest.changePage('3');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/commerce/quotes', { i: '3' }]);
      });
    });

    describe('onSearch()', () => {
      it('should call getQuotes on the quotes service with the proper query', () => {
        componentUnderTest.onSearch({ q: 'ross' });
        expect(mockQuotesService.getQuotes).toHaveBeenCalledWith(false, { q: 'ross' });
      });
    });

    describe('onSortResults()', () => {
      let mockSort: any;
      beforeEach(() => {
        mockSort = { sort: { s: 'createdOn', d: true }, value: 'createdNewestFirst', id: 1 };
        componentUnderTest.onSortResults(mockSort);
      });
      it('should set the current sort', () => {
        expect(componentUnderTest.currentSort).toEqual(mockSort);
      });

      it('should call navigate on the router with the proper params', () => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/commerce/quotes', { s: 'createdOn', d: true }]);
      });
    });

    describe('onFilterResults()', () => {
      let mockFilter: any;
      beforeEach(() => {
        mockFilter = { id: 1, value: 'active', status: { status: 'active' } };
        componentUnderTest.onFilterResults(mockFilter);
      });

      it('should set the current filter', () => {
        expect(componentUnderTest.currentFilter).toBe(mockFilter);
      });

      it('should call getQuotes on the quotes servicve with the correct params', () => {
        expect(mockQuotesService.getQuotes).toHaveBeenCalledWith(false, { status: 'active' });
      });
    });

    describe('onEditQuote()', () => {
      it('call setFocused() on the quotes service', () => {
        componentUnderTest.onEditQuote(1);

        expect(mockQuotesService.setFocused).toHaveBeenCalledWith(1);
      });

      it('should navigate', () => {
        componentUnderTest.onEditQuote(1);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/commerce/activeQuote']);
      });
    });

    describe('onSetAsFocusedQuote()', () => {
      it('call setFocused() on the quotes service', () => {
        componentUnderTest.onSetAsFocusedQuote(1);

        expect(mockQuotesService.setFocused).toHaveBeenCalledWith(1);
      });
    });
  });
}
