import { Observable } from 'rxjs/Rx';
import { AppComponent } from './app.component';
import { NavigationEnd } from '@angular/router';

export function main() {
  describe('App Component', () => {
    (<any>window).portal = 'core';
    let mockUiConfig: any, mockRouter: any, mockMultiLingual: any, mockSearchContext: any, mockCurrentUser: any,
      mockCollections: any, mockActiveCollection: any, mockUiState: any, mockUserPreference: any, mockRenderer: any, mockNotification: any,
      mockApiConfig: any, mockAuthentication: any, mockUserCan: any, mockCartSummary: any, mockWindow: any;
    let loggedInState = false, canViewCollections = true;
    let nextNavigation: NavigationEnd = new NavigationEnd(1, '/', '/');
    let componentUnderTest: AppComponent;

    beforeEach(() => {
      mockUiConfig = { initialize: jasmine.createSpy('initialize').and.returnValue(Observable.of({})) };
      mockRouter = { events: Observable.of(nextNavigation) };
      mockMultiLingual = { setLanguage: jasmine.createSpy('setLanguage') };
      mockSearchContext = {
        update: null,
        go: jasmine.createSpy('go')
      };
      mockCurrentUser = {
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
          searchSortOptionId: 23
        },
        reset: jasmine.createSpy('reset'),
        getPrefs: jasmine.createSpy('getPrefs')
      };
      mockRenderer = { listenGlobal: jasmine.createSpy('listenGlobal').and.callFake((a: any, b: any, c: Function) => { c(); }) };
      mockNotification = { check: jasmine.createSpy('check'), initialize: jasmine.createSpy('initialize') };
      mockApiConfig = { getPortal: () => (<any>window).portal, setPortal: jasmine.createSpy('setPortal') };
      mockAuthentication = { destroy: jasmine.createSpy('destroy').and.returnValue(Observable.of({})) };
      mockUserCan = { viewCollections: () => canViewCollections };
      mockCartSummary = { loadCartSummary: jasmine.createSpy('loadCartSummary') };
      mockWindow = { pageYOffset: 133, scrollTo: jasmine.createSpy('scrollTo') };
      componentUnderTest = new AppComponent(
        mockUiConfig, mockRouter, mockMultiLingual, mockSearchContext, mockCurrentUser,
        mockCollections, mockActiveCollection, mockUiState, mockUserPreference, mockRenderer,
        mockNotification, mockApiConfig, mockAuthentication, mockUserCan, mockCartSummary, null, mockWindow);
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
          expect(mockCurrentUser.set).toHaveBeenCalled();
        });
      });

      describe('listenGlobal()', () => {
        it('Should listen for a scroll event', () => {
          componentUnderTest.ngOnInit();
          expect(mockRenderer.listenGlobal).toHaveBeenCalledWith('document', 'scroll', jasmine.any(Function));
        });

        it('Should move the header based on the pageYOffset', () => {
          componentUnderTest.ngOnInit();
          expect(mockUiState.showFixedHeader).toHaveBeenCalledWith(133);
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
          expect(mockCartSummary.loadCartSummary).toHaveBeenCalled();
          expect(mockActiveCollection.load).not.toHaveBeenCalled();
        });

        it('Should process the actions for a logged in user with view collections permissions', () => {
          loggedInState = true;
          canViewCollections = true;
          componentUnderTest.ngOnInit();
          expect(mockUserPreference.getPrefs).toHaveBeenCalled();
          expect(mockActiveCollection.load).toHaveBeenCalled();
          expect(mockCollections.load).toHaveBeenCalled();
          expect(mockCartSummary.loadCartSummary).toHaveBeenCalled();
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
      it('Should log out a user on the server', () => {
        componentUnderTest.logout();
        expect(mockAuthentication.destroy).toHaveBeenCalled();
      });

      it('Should log out the user in the browser', () => {
        componentUnderTest.logout();
        expect(mockCurrentUser.destroy).toHaveBeenCalled();
      });
    });

    describe('changeLang()', () => {
      it('Should change the current language', () => {
        componentUnderTest.changeLang({ lang: 'fr' });
        expect(mockMultiLingual.setLanguage).toHaveBeenCalledWith({ lang: 'fr' });
      });
    });

    describe('newSearchContext()', () => {
      it('Should update the searchContext with a new query and naviagate go()', () => {
        componentUnderTest.newSearchContext('dogs');
        expect(mockSearchContext.update).toEqual({ q: 'dogs', i: 1, n: 100, sortId: 23 });
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

  });
}
