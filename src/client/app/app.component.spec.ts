import { Observable } from 'rxjs/Observable';
import { Event, NavigationEnd, RoutesRecognized } from '@angular/router';

import { AppComponent } from './app.component';
import { MockAppStore } from './store/spec-helpers/mock-app.store';

export function main() {
  describe('App Component', () => {
    (<any>window).portal = 'core';
    let mockUiConfig: any, mockRouter: any, mockSearchContext: any, mockCurrentUserService: any,
      mockCollections: any, mockUiState: any, mockUserPreference: any, mockNotification: any,
      mockUserCan: any, mockWindow: any, mockNgZone: any, componentUnderTest: AppComponent, mockStore: MockAppStore,
      mockFilter: any, mockSortDefinition: any, cartLoadSpy: jasmine.Spy, collectionLoadSpy: jasmine.Spy,
      quoteLoadSpy: jasmine.Spy, setLanguageSpy: jasmine.Spy;

    let loggedInState: boolean = false, canViewCollections: boolean = true, canAdministerQuotes: boolean = false;
    let nextNavigation: Event;
    let configHasLoaded: boolean = true;

    beforeEach(() => {
      mockUiConfig = {
        initialize: jasmine.createSpy('initialize').and.returnValue(Observable.of({})),
        hasLoaded: () => configHasLoaded,
        load: jasmine.createSpy('load').and.returnValue(Observable.of({}))
      };

      mockRouter = { events: Observable.of(nextNavigation), initialNavigation: jasmine.createSpy('initialNavigation') };

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
        reset: jasmine.createSpy('reset'),
        data: Observable.of({ loadingIndicator: true })
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

      mockUserCan = { viewCollections: () => canViewCollections, administerQuotes: () => canAdministerQuotes };
      mockWindow = { nativeWindow: { pageYOffset: 133, scrollTo: jasmine.createSpy('scrollTo') } };
      mockFilter = { load: jasmine.createSpy('load').and.returnValue(Observable.of({})) };
      mockSortDefinition = { getSortDefinitions: () => Observable.of({ currentSort: { id: 1 } }) };
      mockNgZone = { runOutsideAngular: () => true };
      mockStore = new MockAppStore();

      collectionLoadSpy = mockStore.createActionFactoryMethod('activeCollection', 'load');
      cartLoadSpy = mockStore.createActionFactoryMethod('cart', 'load');
      quoteLoadSpy = mockStore.createActionFactoryMethod('quoteEdit', 'load');
      setLanguageSpy = mockStore.createActionFactoryMethod('multiLingual', 'setLanguage');

      componentUnderTest = new AppComponent(
        mockUiConfig, mockRouter, mockSearchContext, mockCurrentUserService,
        mockCollections, mockUiState, mockUserPreference, mockUserCan, mockWindow,
        mockFilter, mockSortDefinition, mockNgZone, mockStore
      );
    });


    describe('ngOnInit()', () => {
      describe('Set the default language', () => {
        it('dispatchs the default language to be set', () => {
          componentUnderTest.ngOnInit();
          expect(setLanguageSpy).toHaveBeenCalledWith('en');
        });
      });
      describe('processUser()', () => {
        beforeEach(() => {
          nextNavigation = new NavigationEnd(1, '/', '/');
        });

        it('Should process the actions for a logged out user', () => {
          loggedInState = false;
          componentUnderTest.ngOnInit();
          expect(mockCollections.destroyAll).toHaveBeenCalled();
          expect(mockUiState.reset).toHaveBeenCalled();
          expect(mockUserPreference.reset).toHaveBeenCalled();
        });

        it('Should process the actions for a logged in user - without administer quotes', () => {
          loggedInState = true;
          canAdministerQuotes = false;
          componentUnderTest.ngOnInit();

          expect(mockUserPreference.getPrefs).toHaveBeenCalled();
          expect(cartLoadSpy).toHaveBeenCalled();
        });

        it('Should process the actions for a logged in user - with administer quotes', () => {
          loggedInState = true;
          canAdministerQuotes = true;
          componentUnderTest.ngOnInit();

          expect(mockUserPreference.getPrefs).toHaveBeenCalled();
          expect(quoteLoadSpy).toHaveBeenCalled();
        });
      });

      describe('toggleFilterTreePreference()', () => {
        it('should call toggleFilterTree() on the user preference service', () => {
          componentUnderTest.toggleFilterTreePreference();

          expect(mockUserPreference.toggleFilterTree).toHaveBeenCalled();
        });
      });

      describe('routerChanges()', () => {
        describe('for NavigationEnd', () => {
          beforeEach(() => {
            nextNavigation = new NavigationEnd(1, '/', '/');
            componentUnderTest.ngOnInit();
          });

          it('Pass the current state url to see if we should display the search bar', () => {
            expect(mockUiState.checkRouteForSearchBar).toHaveBeenCalledWith('/');
          });

          it('Pass the current state url to see if we should display the filters', () => {
            expect(mockUiState.checkForFilters).toHaveBeenCalledWith('/');
          });

          it('Assign the current url state to an instance variable', () => {
            expect(componentUnderTest.state).toEqual('/');
          });

          it('Should make sure the page is scrolled to the top on each successful state change', () => {
            expect(mockWindow.nativeWindow.scrollTo).toHaveBeenCalledWith(0, 0);
          });
        });
      });
    });

    describe('logout()', () => {
      it('Should log out the user in the browser', () => {
        componentUnderTest.logout();
        expect(mockCurrentUserService.destroy).toHaveBeenCalled();
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
        componentUnderTest.ngOnInit();

        expect(mockRouter.initialNavigation).toHaveBeenCalled();
        expect(mockUiConfig.load).not.toHaveBeenCalled();
      });

      it('Should load the config if it is not loaded and then initialize the navigation', () => {
        configHasLoaded = false;

        componentUnderTest = new AppComponent(
          mockUiConfig, mockRouter, mockSearchContext, mockCurrentUserService,
          mockCollections, mockUiState, mockUserPreference, mockUserCan,
          mockWindow, mockFilter, mockSortDefinition, mockNgZone, mockStore
        );
        componentUnderTest.ngOnInit();
        expect(mockUiConfig.load).toHaveBeenCalled();
        expect(mockRouter.initialNavigation).toHaveBeenCalled();
      });
    });

  });
}
