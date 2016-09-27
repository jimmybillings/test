import {
  beforeEachProvidersArray,
  inject,
  TestBed,
} from '../../imports/test.imports';
import { UserPreferenceService } from './user-preference.service';

export function main() {
  describe('UserPreferenceService', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        UserPreferenceService
      ]
    }));

    it('Should have an instance of currentUser, store, api and apiConfig',
      inject([UserPreferenceService], (service: UserPreferenceService) => {
        expect(service.store).toBeDefined();
        expect(service.api).toBeDefined();
      }));

    it('Should have an update() method that updates the store',
      inject([UserPreferenceService], (service: UserPreferenceService) => {
        spyOn(service.store, 'dispatch');
        service.update({filterCounts: true});
        expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'USER_PREFS.UPDATE_PREFERENCES', payload: {filterCounts: true} });
      }));

    it('Should have a state() getter method that returns the state of the store',
      inject([UserPreferenceService], (service: UserPreferenceService) => {
        expect(service.state).toEqual({ displayFilterCounts: false, collectionTrayIsOpen: false, searchIsOpen: true });
      }));

    it('Should have a openCollectionTray method that sets the collectionTrayIsOpen property to true',
      inject([UserPreferenceService], (service: UserPreferenceService) => {
        service.openCollectionTray();
        service.data.first().subscribe(data => {
          expect(data.collectionTrayIsOpen).toEqual(true);
        });
      }));

    it('Should have a toggleCollectionTray method that toggles the collectionTrayIsOpen property',
      inject([UserPreferenceService], (service: UserPreferenceService) => {
        service.toggleCollectionTray();
        service.data.first().subscribe(data => {
          expect(data.collectionTrayIsOpen).toEqual(true);
        });
      }));

    it('Should have a closeSearch method that sets the searchIsOpen property to false',
      inject([UserPreferenceService], (service: UserPreferenceService) => {
        service.closeSearch();
        service.data.first().subscribe(data => {
          expect(data.searchIsOpen).toEqual(false);
        });
      }));

    it('Should have a toggleSearch method that toggles the searchIsOpen property',
      inject([UserPreferenceService], (service: UserPreferenceService) => {
        service.toggleSearch();
        service.data.first().subscribe(data => {
          expect(data.searchIsOpen).toEqual(false);
        });
      }));
  });
}
