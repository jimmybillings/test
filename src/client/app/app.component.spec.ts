import { Observable } from 'rxjs/Observable';
import { NavigationEnd } from '@angular/router';

import { AppComponent } from './app.component';
import { MockAppStore } from './store/spec-helpers/mock-app.store';

export function main() {
  describe('App Component', () => {
    (<any>window).portal = 'core';
    let mockUiConfig: any, mockRouter: any, mockMultiLingual: any, mockSearchContext: any, mockCurrentUserService: any,
      mockCollections: any, mockUiState: any, mockUserPreference: any, mockNotification: any, mockApiConfig: any,
      mockUserCan: any, mockWindow: any, mockNgZone: any, componentUnderTest: AppComponent, mockStore: MockAppStore,
      mockFilter: any, mockSortDefinition: any, cartLoadSpy: jasmine.Spy, collectionLoadSpy: jasmine.Spy,
      quoteLoadSpy: jasmine.Spy;

    let loggedInState: boolean = false, canViewCollections: boolean = true;
    let nextNavigation: NavigationEnd = new NavigationEnd(1, '/', '/');
    let configHasLoaded: boolean = true;

    beforeEach(() => {
      mockUiConfig = {
        initialize: jasmine.createSpy('initialize').and.returnValue(Observable.of({})),
        hasLoaded: () => configHasLoaded,
        load: jasmine.createSpy('load').and.returnValue(Observable.of({}))
      };

      mockRouter = { events: Observable.of(nextNavigation), initialNavigation: jasmine.createSpy('initialNavigation') };

      mockMultiLingual = { setLanguage: jasmine.createSpy('setLanguage'), setBaseUrl: jasmine.createSpy('setBaseUrl') };

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

      mockApiConfig = {
        getPortal: () => (<any>window).portal, setPortal: jasmine.createSpy('setPortal'),
        baseUrl: () => jasmine.createSpy('baseUrl')
      };

      mockUserCan = { viewCollections: () => canViewCollections, administerQuotes: () => false };
      mockWindow = { nativeWindow: { pageYOffset: 133, scrollTo: jasmine.createSpy('scrollTo') } };
      mockFilter = { load: jasmine.createSpy('load').and.returnValue(Observable.of({})) };
      mockSortDefinition = { getSortDefinitions: () => Observable.of({ currentSort: { id: 1 } }) };
      mockNgZone = { runOutsideAngular: () => true };
      mockStore = new MockAppStore();

      collectionLoadSpy = mockStore.createActionFactoryMethod('activeCollection', 'load');
      cartLoadSpy = mockStore.createActionFactoryMethod('cart', 'load');
      quoteLoadSpy = mockStore.createActionFactoryMethod('quote', 'load');

      componentUnderTest = new AppComponent(
        mockUiConfig, mockRouter, mockMultiLingual, mockSearchContext, mockCurrentUserService,
        mockCollections, mockUiState, mockUserPreference, mockApiConfig, mockUserCan, mockWindow,
        mockFilter, mockSortDefinition, null, null, mockNgZone, mockStore
      );
    });


    describe('ngOnInit()', () => {
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
          expect(cartLoadSpy).toHaveBeenCalled();
          expect(collectionLoadSpy).not.toHaveBeenCalled();
        });

        it('Should process the actions for a logged in user with view collections permissions', () => {
          loggedInState = true;
          canViewCollections = true;

          mockStore.createStateElement('activeCollection', 'loaded', true);

          componentUnderTest.ngOnInit();
          expect(mockUserPreference.getPrefs).toHaveBeenCalled();
          expect(collectionLoadSpy).toHaveBeenCalled();
          expect(cartLoadSpy).toHaveBeenCalled();
          expect(mockCollections.load).toHaveBeenCalled();
        });
      });

      describe('toggleFilterTreePreference()', () => {
        it('should call toggleFilterTree() on the user preference service', () => {
          componentUnderTest.toggleFilterTreePreference();

          expect(mockUserPreference.toggleFilterTree).toHaveBeenCalled();
        });
      });

      describe('routerChanges()', () => {
        beforeEach(() => {
          mockStore.createActionFactoryMethod('activeCollection', 'load');
        });

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
          expect(mockWindow.nativeWindow.scrollTo).toHaveBeenCalledWith(0, 0);
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

    describe('loadConfig', () => {
      it('Should initialize the navigation immediatly if the config is already loaded', () => {
        componentUnderTest = new AppComponent(
          mockUiConfig, mockRouter, mockMultiLingual, mockSearchContext, mockCurrentUserService,
          mockCollections, mockUiState, mockUserPreference, mockApiConfig, mockUserCan,
          mockWindow, mockFilter, mockSortDefinition, null, null, mockNgZone, mockStore
        );

        expect(mockRouter.initialNavigation).toHaveBeenCalled();
        expect(mockUiConfig.load).not.toHaveBeenCalled();
      });

      it('Should load the config if it is not loaded and then initialize the navigation', () => {
        configHasLoaded = false;

        componentUnderTest = new AppComponent(
          mockUiConfig, mockRouter, mockMultiLingual, mockSearchContext, mockCurrentUserService,
          mockCollections, mockUiState, mockUserPreference, mockApiConfig, mockUserCan,
          mockWindow, mockFilter, mockSortDefinition, null, null, mockNgZone, mockStore
        );

        expect(mockUiConfig.load).toHaveBeenCalled();
        expect(mockRouter.initialNavigation).toHaveBeenCalled();
      });
    });

  });
}
