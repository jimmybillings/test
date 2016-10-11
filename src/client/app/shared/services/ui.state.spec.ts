import {
  inject,
  beforeEachProvidersArray,
  TestBed
} from '../../imports/test.imports';
import { UiState, } from './ui.state';

export function main() {
  describe('UI State', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        UiState
      ]
    }));

    it('Should initialize booleans in the store to define default positioning and state',
      inject([UiState], (service: UiState) => {
        service.data.first().subscribe(data => {
          expect(data).toEqual(mockState());
        });
      }));



    it('Should have a showCollectionsList method that sets the collectionsListIsOpen to true',
      inject([UiState], (service: UiState) => {
        service.showCollectionsList();
        service.data.first().subscribe(data => {
          expect(data.collectionsListIsOpen).toEqual(true);
        });
      }));

    it('Should have a closeCollectionsList method that sets the collectionsListIsOpen to false',
      inject([UiState], (service: UiState) => {
        service.showCollectionsList();
        service.closeCollectionsList();
        service.data.first().subscribe(data => {
          expect(data.collectionsListIsOpen).toEqual(false);
        });
      }));

    it('Should have an update method that updates the store with the payload',
      inject([UiState], (service: UiState) => {
        service.update({ collectionTrayIsOpen: true });
        service.data.first().subscribe(data => {
          expect(data.collectionTrayIsOpen).toEqual(true);
        });
      }));

    it('Should have a reset() method that resets the store to the initial state',
      inject([UiState], (service: UiState) => {
        service.data.first().subscribe(data => {
          expect(data).toEqual(mockState());
        });
        service.reset();
        service.data.first().subscribe(data => {
          expect(data).toEqual(mockState());
        });
      }));

    it('Should set the header to absolute by setting \'showFixed\' to be false if the page scrolls less than 111px\'s',
      inject([UiState], (service: UiState) => {
        service.showFixedHeader(108);
        service.data.first().subscribe(data => {
          expect(data.showFixed).toEqual(false);
        });
      }));

    it('Should set the header to fixed by setting \'showFixed\' to be true if the page scrolls down more than 111px\'s',
      inject([UiState], (service: UiState) => {
        service.showFixedHeader(114);
        service.data.first().subscribe(data => {
          expect(data.showFixed).toEqual(true);
        });
      }));

    it('Should hide the search bar on certain routes', inject([UiState], (service: UiState) => {
      ['/', 'admin', 'user/register', 'user/login', 'notification'].forEach(item => {
        service.checkRouteForSearchBar(item);
        service.data.first().subscribe(data => {
          expect(data.headerIsExpanded).toEqual(false);
        });
      });
    }));

    it('Should show the search bar on other routes', inject([UiState], (service: UiState) => {
      ['asdf', 'fdsadsf', 'fdsf', 'wefwer', 'aasfasdf'].forEach((item) => {
        service.checkRouteForSearchBar(item);
        service.data.first().subscribe(data => {
          expect(data.headerIsExpanded).toEqual(true);
        });
      });
    }));

    it('Should hide the filter button by default if \'headerIsExpanded\' is false and by pass the url check',
      inject([UiState], (service: UiState) => {
        service.update({ headerIsExpanded: false });
        service.checkForFilters('search');
        service.data.first().subscribe(data => {
          expect(data.filtersAreAvailable).toEqual(false);
        });
      }));

    it('Should hide the filter button if \'headerIsExpanded\' is true but the url check return false',
      inject([UiState], (service: UiState) => {
        service.update({ headerIsExpanded: true });
        service.checkForFilters('user/login');
        service.data.first().subscribe(data => {
          expect(data.filtersAreAvailable).toEqual(false);
        });
      }));

    it('Should show the filter button if \'headerIsExpanded\' is true and the url check return true',
      inject([UiState], (service: UiState) => {
        service.update({ headerIsExpanded: true });
        service.checkForFilters('search/234');
        service.data.first().subscribe(data => {
          expect(data.filtersAreAvailable).toEqual(true);
        });
      }));

    function mockState() {
      return {
        collectionsListIsOpen: false,
        collectionsSortIsOpen: false,
        collectionsFilterIsOpen: false,
        headerIsExpanded: false,
        showFixed: false,
        loading: false,
        filtersAreAvailable: false
      };
    }
  });
}
