import { Observable } from 'rxjs/Rx';
import { AppComponent } from './app.component';
import { NavigationEnd } from '@angular/router';

export function main() {
  describe('App Component', () => {
    (<any>window).portal = 'core';
    let mockUiConfig: any, mockRouter: any, mockMultiLingual: any, mockSearchContext: any, mockCurrentUserService: any,
      mockCollections: any, mockActiveCollection: any, mockUiState: any, mockUserPreference: any, mockNotification: any,
      mockApiConfig: any, mockUserCan: any, mockCart: any, mockWindow: any,
      mockFilter: any, mockSortDefinition: any;
    let loggedInState = false, canViewCollections = true;
    let nextNavigation: NavigationEnd = new NavigationEnd(1, '/', '/');
    let componentUnderTest: AppComponent;

    beforeEach(() => {
      mockUiConfig = { initialize: jasmine.createSpy('initialize').and.returnValue(Observable.of({})) };
      mockRouter = { events: Observable.of(nextNavigation) };
      mockMultiLingual = { setLanguage: jasmine.createSpy('setLanguage') };
      mockSearchContext = {
        update: null,
        go: jasmine.createSpy('go'),
        new: jasmine.createSpy('new'),
        state: { q: 'cat', i: 7, n: 100, sortId: 23, filterIds: '1517', filterValues: '1517:2015-12-10 - 2016-12-12' }
      };
      mockCurrentUserService = {
        set: jasmine.createSpy('set'),
        destroy: jasmine.createSpy('destroy'),
        loggedIn: () => true,
        loggedInState: () => Observable.of(loggedInState)
      };
      mockCollections = {
        load: jasmine.createSpy('load').and.returnValue(Observable.of({})),
        destroyAll: jasmine.createSpy('destroyAll')
      };
      mockActiveCollection = {
        load: jasmine.createSpy('load').and.returnValue(Observable.of({ id: 1 })),
        getItems: jasmine.createSpy('getItems').and.returnValue(Observable.of({}))
      };
      mockUiState = {
        showFixedHeader: jasmine.createSpy('showFixedHeader'),
        checkRouteForSearchBar: jasmine.createSpy('checkRouteForSearchBar'),
        checkForFilters: jasmine.createSpy('checkForFilters'),
        reset: jasmine.createSpy('reset')
      };
      mockUserPreference = {
        state: {
          sortId: 23,
          displayFilterCounts: true
        },
        reset: jasmine.createSpy('reset'),
        getPrefs: jasmine.createSpy('getPrefs'),
        toggleFilterTree: jasmine.createSpy('toggleFilterTree'),
        updateSortPreference: jasmine.createSpy('updateSortPreference')
      };
      mockNotification = { check: jasmine.createSpy('check'), initialize: jasmine.createSpy('initialize') };
      mockApiConfig = { getPortal: () => (<any>window).portal, setPortal: jasmine.createSpy('setPortal') };
      mockUserCan = { viewCollections: () => canViewCollections };
      mockCart = { getCartSummary: jasmine.createSpy('getCartSummary') };
      mockWindow = { pageYOffset: 133, scrollTo: jasmine.createSpy('scrollTo') };
      mockFilter = { load: jasmine.createSpy('load').and.returnValue(Observable.of({})) };
      mockSortDefinition = { getSortDefinitions: () => Observable.of({ currentSort: { id: 1 } }) };
      componentUnderTest = new AppComponent(
        mockUiConfig, mockRouter, mockMultiLingual, mockSearchContext, mockCurrentUserService,
        mockCollections, mockActiveCollection, mockUiState, mockUserPreference,
        mockNotification, mockApiConfig, mockUserCan,
        mockCart, mockWindow, mockFilter, mockSortDefinition, null, null);
    });


    describe('ngOnInit()', () => {

      describe('apiConfig.setPortal()', () => {
        it('Should set the portal name', () => {
          componentUnderTest.ngOnInit();
          expect(mockApiConfig.setPortal).toHaveBeenCalledWith('core');
        });
      });

      describe('notification.initialize()', () => {
        it('Should initialize the notification service with the global element target', () => {
          componentUnderTest.ngOnInit();
          expect(mockNotification.initialize).toHaveBeenCalled();
        });
      });

      describe('currentUser.set()', () => {
        it('Should set the current user', () => {
          componentUnderTest.ngOnInit();
          expect(mockCurrentUserService.set).toHaveBeenCalled();
        });
      });

      describe('uiConfig.initialize()', () => {
        it('Should initailize the UI config with the correct parameters', () => {
          componentUnderTest.ngOnInit();
          expect(mockUiConfig.initialize).toHaveBeenCalledWith(true, 'core');
        });
      });

      describe('processUser()', () => {
        it('Should process the actions for a logged out user', () => {
          loggedInState = false;
          componentUnderTest.ngOnInit();
          expect(mockCollections.destroyAll).toHaveBeenCalled();
          expect(mockUiState.reset).toHaveBeenCalled();
          expect(mockUserPreference.reset).toHaveBeenCalled();
        });

        it('Should process the actions for a logged in user without view collections permissions', () => {
          loggedInState = true;
          canViewCollections = false;
          componentUnderTest.ngOnInit();
          expect(mockUserPreference.getPrefs).toHaveBeenCalled();
          expect(mockCart.getCartSummary).toHaveBeenCalled();
          expect(mockActiveCollection.load).not.toHaveBeenCalled();
        });

        it('Should process the actions for a logged in user with view collections permissions', () => {
          loggedInState = true;
          canViewCollections = true;
          componentUnderTest.ngOnInit();
          expect(mockUserPreference.getPrefs).toHaveBeenCalled();
          expect(mockActiveCollection.load).toHaveBeenCalled();
          expect(mockCollections.load).toHaveBeenCalled();
          expect(mockCart.getCartSummary).toHaveBeenCalled();
        });
      });

      describe('toggleFilterTreePreference()', () => {
        it('should call toggleFilterTree() on the user preference service', () => {
          componentUnderTest.toggleFilterTreePreference();

          expect(mockUserPreference.toggleFilterTree).toHaveBeenCalled();
        });
      });

      describe('routerChanges()', () => {
        it('Pass the current state url to see if we should display the search bar', () => {
          componentUnderTest.ngOnInit();
          expect(mockUiState.checkRouteForSearchBar).toHaveBeenCalledWith('/');
        });
        it('Pass the current state url to see if we should display the filters', () => {
          componentUnderTest.ngOnInit();
          expect(mockUiState.checkForFilters).toHaveBeenCalledWith('/');
        });
        it('Assign the current url state to an instance variable', () => {
          componentUnderTest.ngOnInit();
          expect(componentUnderTest.state).toEqual('/');
        });
        it('Should make sure the page is scrolled to the top on each successful state change', () => {
          componentUnderTest.ngOnInit();
          expect(mockWindow.scrollTo).toHaveBeenCalledWith(0, 0);
        });
      });
    });

    describe('logout()', () => {

      it('Should log out the user in the browser', () => {
        componentUnderTest.logout();
        expect(mockCurrentUserService.destroy).toHaveBeenCalled();
      });
    });

    describe('changeLang()', () => {
      it('Should change the current language', () => {
        componentUnderTest.changeLang({ lang: 'fr' });
        expect(mockMultiLingual.setLanguage).toHaveBeenCalledWith({ lang: 'fr' });
      });
    });

    describe('newSearchContext()', () => {
      it('Should merge the searchContext with a new query and get a new filter tree', () => {
        componentUnderTest.newSearchContext('dogs');
        expect(mockSearchContext.new).toHaveBeenCalledWith(
          {
            q: 'dogs', i: 1, n: 100, sortId: 23, filterIds: '1517',
            filterValues: '1517:2015-12-10 - 2016-12-12'
          });
        expect(mockFilter.load).toHaveBeenCalledWith(
          {
            q: 'dogs', i: 1, n: 100, sortId: 23, filterIds: '1517',
            filterValues: '1517:2015-12-10 - 2016-12-12'
          }, true);
      });
    });

  });
}
