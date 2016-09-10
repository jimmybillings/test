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

    it('Should have a openBinTray method that sets the binTrayIsOpen property to true',
      inject([UiState], (service: UiState) => {
        service.openBinTray();
        service.data.first().subscribe(data => {
          expect(data.binTrayIsOpen).toEqual(true);
        });
      }));

    it('Should have a closeBinTray method that sets the binTrayIsOpen property to false',
      inject([UiState], (service: UiState) => {
        service.openBinTray();
        service.closeBinTray();
        service.data.first().subscribe(data => {
          expect(data.binTrayIsOpen).toEqual(false);
        });
      }));

    it('Should have a toggleBinTray method that toggles the binTrayIsOpen property',
      inject([UiState], (service: UiState) => {
        service.toggleBinTray();
        service.data.first().subscribe(data => {
          expect(data.binTrayIsOpen).toEqual(true);
        });
      }));

    it('Should have a openSearch method that sets the searchIsOpen property to true',
      inject([UiState], (service: UiState) => {
        service.openSearch();
        service.data.first().subscribe(data => {
          expect(data.searchIsOpen).toEqual(true);
        });
      }));

    it('Should have a closeSearch method that sets the searchIsOpen property to false',
      inject([UiState], (service: UiState) => {
        service.openSearch();
        service.closeSearch();
        service.data.first().subscribe(data => {
          expect(data.searchIsOpen).toEqual(false);
        });
      }));

    it('Should have a toggleSearch method that toggles the searchIsOpen property',
      inject([UiState], (service: UiState) => {
        service.toggleSearch();
        service.data.first().subscribe(data => {
          expect(data.searchIsOpen).toEqual(false);
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
        service.update({ binTrayIsOpen: true });
        service.data.first().subscribe(data => {
          expect(data.binTrayIsOpen).toEqual(true);
        });
      }));

    it('Should have a reset() method that resets the store to the initial state',
      inject([UiState], (service: UiState) => {
        service.data.first().subscribe(data => {
          expect(data).toEqual(mockState());
        });
        service.openBinTray();
        service.closeSearch();
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
      ['/', 'admin', 'user', 'notification'].forEach(item => {
        service.checkRouteForSearchBar(item);
        service.data.first().subscribe(data => {
          expect(data.searchBarIsActive).toEqual(false);
        });
      });
    }));

    it('Should show the search bar on other routes', inject([UiState], (service: UiState) => {
      ['asdf', 'fdsadsf', 'fdsf', 'wefwer', 'aasfasdf'].forEach((item) => {
        service.checkRouteForSearchBar(item);
        service.data.first().subscribe(data => {
          expect(data.searchBarIsActive).toEqual(true);
        });
      });
    }));

    function mockState() {
      return {
        collectionsListIsOpen: false,
        collectionsSortIsOpen: false,
        collectionsFilterIsOpen: false,
        binTrayIsOpen: false,
        searchIsOpen: true,
        searchBarIsActive: false,
        showFixed: false,
        loading: false
      };
    }
  });
}
