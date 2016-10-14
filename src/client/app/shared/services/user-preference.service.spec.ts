import { UserPreferenceService } from './user-preference.service';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('UserPreferenceService', () => {
    let serviceUnderTest: UserPreferenceService;
    let mockCurrentUserService: any;
    let mockStore: any;
    let mockApiService: any;

    mockCurrentUserService = {
      loggedIn: () => false
    };

    let data = { displayFilterCounts: false, collectionTrayIsOpen: false, searchIsOpen: true, searchSortOptionId: 12 }

    mockStore = {
      dispatch: (_: any) => Object.assign(data, _.payload),
      select: (_: string) => Observable.of(data)
    }

    mockApiService = {
      put2: () => Observable.of({})
    }

    beforeEach(() => {
      serviceUnderTest = new UserPreferenceService(mockCurrentUserService, mockStore, mockApiService);
    });

    it('Should have an instance of currentUser, store, api and apiConfig', () => {
      expect(serviceUnderTest.store).toBeDefined();
      expect(serviceUnderTest.api).toBeDefined();
    });

    it('Should have an set() method that updates the store', () => {
      spyOn(serviceUnderTest.store, 'dispatch');
      serviceUnderTest.set({ filterCounts: true });
      expect(serviceUnderTest.store.dispatch).toHaveBeenCalledWith({ type: 'USER_PREFS.UPDATE_PREFERENCES', payload: { filterCounts: true } });
    });

    it('Should have a state() getter method that returns the state of the store', () => {
      expect(serviceUnderTest.state).toEqual({ displayFilterCounts: false, collectionTrayIsOpen: false, searchIsOpen: true, searchSortOptionId: 12 });
    });

    it('Should have a openCollectionTray method that sets the collectionTrayIsOpen property to true', () => {
      serviceUnderTest.openCollectionTray();
      serviceUnderTest.data.first().subscribe(data => {
        expect(data.collectionTrayIsOpen).toEqual(true);
      });
    });

    it('Should have a toggleCollectionTray method that toggles the collectionTrayIsOpen property', () => {
      serviceUnderTest.openCollectionTray();
      serviceUnderTest.toggleCollectionTray();
      serviceUnderTest.data.first().subscribe(data => {
        expect(data.collectionTrayIsOpen).toEqual(false);
      });
    });

    it('Should have a closeSearch method that sets the searchIsOpen property to false', () => {
      serviceUnderTest.closeSearch();
      serviceUnderTest.data.first().subscribe(data => {
        expect(data.searchIsOpen).toEqual(false);
      });
    });

    it('Should have a toggleSearch method that toggles the searchIsOpen property', () => {
      serviceUnderTest.closeSearch();
      serviceUnderTest.toggleSearch();
      serviceUnderTest.data.first().subscribe(data => {
        expect(data.searchIsOpen).toEqual(true);
      });
    });
  });
}
