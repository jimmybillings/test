import { Observable } from 'rxjs/Observable';
import { Event, NavigationEnd, RoutesRecognized } from '@angular/router';

import { AppComponent } from './app.component';
import { MockAppStore } from './store/spec-helpers/mock-app.store';

export function main() {
  describe('App Component', () => {
    (<any>window).portal = 'core';
    let mockUiConfig: any, mockRouter: any, mockMultiLingual: any, mockSearchContext: any, mockCurrentUserService: any,
      mockCollections: any, mockUserPreference: any, mockNotification: any,
      mockUserCan: any, mockWindow: any, mockNgZone: any, componentUnderTest: AppComponent, mockStore: MockAppStore,
      mockFilter: any, mockSortDefinition: any, cartLoadSpy: jasmine.Spy, collectionLoadSpy: jasmine.Spy,
      quoteLoadSpy: jasmine.Spy;

    let setHeaderPositionSpy: jasmine.Spy;
    let checkIfFiltersAreAvailableSpy: jasmine.Spy;
    let checkIfHeaderCanBeFixedSpy: jasmine.Spy;
    let resetSpy: jasmine.Spy;
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
      setHeaderPositionSpy = mockStore.createActionFactoryMethod('headerDisplayOptions', 'setHeaderPosition');
      checkIfHeaderCanBeFixedSpy = mockStore.createActionFactoryMethod('headerDisplayOptions', 'checkIfHeaderCanBeFixed');
      checkIfFiltersAreAvailableSpy = mockStore.createActionFactoryMethod('headerDisplayOptions', 'checkIfFiltersAreAvailable');
      resetSpy = mockStore.createActionFactoryMethod('headerDisplayOptions', 'reset');

      componentUnderTest = new AppComponent(
        mockUiConfig, mockRouter, mockMultiLingual, mockSearchContext, mockCurrentUserService,
        mockCollections, mockUserPreference, mockUserCan, mockWindow,
        mockFilter, mockSortDefinition, mockNgZone, mockStore
      );
    });


    describe('ngOnInit()', () => {
      describe('processUser()', () => {
        beforeEach(() => {
          nextNavigation = new NavigationEnd(1, '/', '/');
        });

        it('Should process the actions for a logged out user', () => {
          loggedInState = false;
          componentUnderTest.ngOnInit();
          expect(mockCollections.destroyAll).toHaveBeenCalled();
          mockStore.expectDispatchFor(resetSpy);
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
            mockStore.expectDispatchFor(checkIfHeaderCanBeFixedSpy, '/');
          });

          it('Pass the current state url to see if we should display the filters', () => {
            mockStore.expectDispatchFor(checkIfFiltersAreAvailableSpy, '/');
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
          mockCollections, mockUserPreference, mockUserCan,
          mockWindow, mockFilter, mockSortDefinition, mockNgZone, mockStore
        );

        expect(mockRouter.initialNavigation).toHaveBeenCalled();
        expect(mockUiConfig.load).not.toHaveBeenCalled();
      });

      it('Should load the config if it is not loaded and then initialize the navigation', () => {
        configHasLoaded = false;

        componentUnderTest = new AppComponent(
          mockUiConfig, mockRouter, mockMultiLingual, mockSearchContext, mockCurrentUserService,
          mockCollections, mockUserPreference, mockUserCan,
          mockWindow, mockFilter, mockSortDefinition, mockNgZone, mockStore
        );

        expect(mockUiConfig.load).toHaveBeenCalled();
        expect(mockRouter.initialNavigation).toHaveBeenCalled();
      });
    });

    describe('headerIsFixed getter', () => {
      it('should return observable of true if the isFixed property of the headerDisplayOptions is true', () => {
        mockStore.createStateSection('headerDisplayOptions', { isFixed: true });
        let isFixed: boolean;
        componentUnderTest.headerIsFixed.take(1).subscribe(fixed => isFixed = fixed);
        expect(isFixed).toBe(true);
      });

      it('should return observable of false if the isFixed property of the headerDisplayOptions is false', () => {
        mockStore.createStateSection('headerDisplayOptions', { isFixed: false });
        let isFixed: boolean;
        componentUnderTest.headerIsFixed.take(1).subscribe(fixed => isFixed = fixed);
        expect(isFixed).toBe(false);
      });
    });

    describe('headerCanBeFixed getter', () => {
      it('should return observable of true if the canBeFixed property of the headerDisplayOptions is true', () => {
        mockStore.createStateSection('headerDisplayOptions', { canBeFixed: true });
        let canBeFixed: boolean;
        componentUnderTest.headerCanBeFixed.take(1).subscribe(fixed => canBeFixed = fixed);
        expect(canBeFixed).toBe(true);
      });

      it('should return observable of false if the canBeFixed property of the headerDisplayOptions is false', () => {
        mockStore.createStateSection('headerDisplayOptions', { canBeFixed: false });
        let canBeFixed: boolean;
        componentUnderTest.headerCanBeFixed.take(1).subscribe(fixed => canBeFixed = fixed);
        expect(canBeFixed).toBe(false);
      });
    });
  });
}
