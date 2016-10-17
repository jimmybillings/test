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

    let data: any = { displayFilterCounts: false, collectionTrayIsOpen: false, searchIsOpen: true, searchSortOptionId: 12 };

    mockStore = {
      dispatch: (_: any) => Object.assign(data, _.payload),
      select: (_: string) => Observable.of(data)
    };

    mockApiService = {
      put: () => Observable.of({})
    };

    beforeEach(() => {
      serviceUnderTest = new UserPreferenceService(mockCurrentUserService, mockStore, mockApiService);
      serviceUnderTest.reset();
    });

    it('Should have an instance of currentUser, store, api and apiConfig', () => {
      expect(serviceUnderTest.store).toBeDefined();
      expect(serviceUnderTest.api).toBeDefined();
    });

    it('Should have a state() getter method that returns the state of the store', () => {
      expect(serviceUnderTest.state).toEqual({ displayFilterCounts: false, collectionTrayIsOpen: false, searchIsOpen: true, searchSortOptionId: 12 });
    });

    it('Should have a toggleSearch method that toggles the searchIsOpen property', () => {
      expect(serviceUnderTest.state.searchIsOpen).toEqual(true);
      serviceUnderTest.toggleSearch();
      expect(serviceUnderTest.state.searchIsOpen).toEqual(false);
      serviceUnderTest.toggleSearch();
      expect(serviceUnderTest.state.searchIsOpen).toEqual(true);
    });

    it('Should have a closeSearch method that sets the searchIsOpen property to false', () => {
      expect(serviceUnderTest.state.searchIsOpen).toEqual(true);
      serviceUnderTest.closeSearch();
      expect(serviceUnderTest.state.searchIsOpen).toEqual(false);
    });

    it('Should have a toggleCollectionTray method that toggles the collectionTrayIsOpen property', () => {
      expect(serviceUnderTest.state.collectionTrayIsOpen).toEqual(false);
      serviceUnderTest.openCollectionTray();
      expect(serviceUnderTest.state.collectionTrayIsOpen).toEqual(true);
      serviceUnderTest.toggleCollectionTray();
      expect(serviceUnderTest.state.collectionTrayIsOpen).toEqual(false);
    });

    it('Should have a openCollectionTray method that sets the collectionTrayIsOpen property to true', () => {
      expect(serviceUnderTest.state.collectionTrayIsOpen).toEqual(false);
      serviceUnderTest.openCollectionTray();
      expect(serviceUnderTest.state.collectionTrayIsOpen).toEqual(true);
    });

    it('Should have an updateSortPreference() method that takes a sortId and sets it in the store', () => {
      expect(serviceUnderTest.state.searchSortOptionId).toEqual(12);
      serviceUnderTest.updateSortPreference(16);
      expect(serviceUnderTest.state.searchSortOptionId).toEqual(16);
    });

    it('Should have an set() method that updates the store', () => {
      spyOn(serviceUnderTest.store, 'dispatch');
      serviceUnderTest.set({ filterCounts: true });
      expect(serviceUnderTest.store.dispatch).toHaveBeenCalledWith({ type: 'USER_PREFS.UPDATE_PREFERENCES', payload: { filterCounts: true } });
    });

    it('Should have an reset method that reset the store to default values', () => {
      expect(serviceUnderTest.state).toEqual({ displayFilterCounts: false, collectionTrayIsOpen: false, searchIsOpen: true, searchSortOptionId: 12 });
      serviceUnderTest.toggleCollectionTray();
      serviceUnderTest.toggleSearch();
      serviceUnderTest.updateSortPreference(100);
      expect(serviceUnderTest.state).toEqual({ displayFilterCounts: false, collectionTrayIsOpen: true, searchIsOpen: false, searchSortOptionId: 100 });
      serviceUnderTest.reset();
      expect(serviceUnderTest.state).toEqual({ displayFilterCounts: false, collectionTrayIsOpen: false, searchIsOpen: true, searchSortOptionId: 12 });
    });
  });
}
