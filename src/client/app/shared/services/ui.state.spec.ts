import { UiState, InitUiState } from './ui.state';
import { Observable } from 'rxjs/Observable';

export function main() {
  let serviceUnderTest: UiState, mockStore: any, mockState: any;

  beforeEach(() => {
    mockState = { showFixedHeader: true };
    mockStore = {
      select: jasmine.createSpy('select').and.returnValue(Observable.of(mockState)),
      dispatch: jasmine.createSpy('dispatch')
    };
    serviceUnderTest = new UiState(mockStore);
  });

  describe('Ui State Service', () => {
    it('Should have an update method that updates the store with the payload', () => {
      serviceUnderTest.update({ collectionTrayIsOpen: true });
      expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.UPDATE', payload: { collectionTrayIsOpen: true } });
    });

    it('Should have a reset() method that resets the store to the initial state', () => {
      serviceUnderTest.reset();
      expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.RESET', payload: InitUiState });
    });

    describe('showFixedHeader()', () => {
      it('should set false for a number less than 111', () => {
        serviceUnderTest.showFixedHeader(108);
        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.UPDATE', payload: { showFixedHeader: false } });
      });

      it('should set true for a number 111 or higher', () => {
        mockState = { showFixedHeader: false };
        mockStore = {
          select: jasmine.createSpy('select').and.returnValue(Observable.of(mockState)),
          dispatch: jasmine.createSpy('dispatch')
        };
        serviceUnderTest = new UiState(mockStore);
        serviceUnderTest.showFixedHeader(114);
        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.UPDATE', payload: { showFixedHeader: true } });
      });
    });

    it('Should hide the search bar on certain routes', () => {
      ['/', 'user/register', 'user/login', 'notification'].forEach(item => {
        serviceUnderTest.checkRouteForSearchBar(item);
        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.UPDATE', payload: { headerIsExpanded: false } });
      });
    });

    it('Should show the search bar on other routes', () => {
      ['asdf', 'fdsadsf', 'fdsf', 'wefwer', 'aasfasdf'].forEach((item) => {
        serviceUnderTest.checkRouteForSearchBar(item);
        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.UPDATE', payload: { headerIsExpanded: true } });
      });
    });

    it('Should hide the filter button by default if \'headerIsExpanded\' is false and by pass the url check', () => {
      mockState = { headerIsExpanded: false };
      mockStore = {
        select: jasmine.createSpy('select').and.returnValue(Observable.of(mockState)),
        dispatch: jasmine.createSpy('dispatch')
      };
      serviceUnderTest = new UiState(mockStore);

      serviceUnderTest.checkForFilters('search');
      expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.UPDATE', payload: { filtersAreAvailable: false } });
    });

    it('Should hide the filter button if \'headerIsExpanded\' is true but the url check return false', () => {
      mockState = { headerIsExpanded: true };
      mockStore = {
        select: jasmine.createSpy('select').and.returnValue(Observable.of(mockState)),
        dispatch: jasmine.createSpy('dispatch')
      };
      serviceUnderTest = new UiState(mockStore);

      serviceUnderTest.checkForFilters('user/login');
      expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.UPDATE', payload: { filtersAreAvailable: false } });
    });

    it('Should show the filter button if \'headerIsExpanded\' is true and the url check return true', () => {
      mockState = { headerIsExpanded: true };
      mockStore = {
        select: jasmine.createSpy('select').and.returnValue(Observable.of(mockState)),
        dispatch: jasmine.createSpy('dispatch')
      };
      serviceUnderTest = new UiState(mockStore);

      serviceUnderTest.checkForFilters('search/234');
      expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'UI.STATE.UPDATE', payload: { filtersAreAvailable: true } });
    });
  });
}
