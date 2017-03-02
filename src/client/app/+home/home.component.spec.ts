
import { Observable } from 'rxjs/Rx';
import { HomeComponent } from './home.component';

export function main() {
  describe('Home Component', () => {
    let componentUnderTest: HomeComponent;
    let loggedIn: boolean;
    let mockCurrentUser: any,
      mockUiConfig: any,
      mockSearchContext: any,
      mockUserPreference: any,
      mockGalleryView: any,
      mockRouter: any,
      mockFilter: any
      ;
    mockUiConfig = {
      get: jasmine.createSpy('get').and.returnValue(
        Observable.of(
          {
            'config': {
              'pageSize': { 'value': '100' },
              'notifications': {
                'items': [{ 'trString': 'NOTIFICATION.NEW_USER' }]
              }
            }
          }))
    };
    mockGalleryView = {
      get: jasmine.createSpy('data').and.returnValue(
        Observable.of(
          {
            'results': [{ 'id': 10, 'name': 'Tee offs', 'resultCount': 6, 'thumbnailUrl': '', 'hasMore': false }]
          }))
    };
    mockCurrentUser = { loggedIn: () => loggedIn };

    mockSearchContext = { new: jasmine.createSpy('new') };
    mockUserPreference = { state: { sortId: 0 } };
    mockFilter = { set: jasmine.createSpy('set'), clear: jasmine.createSpy('clear') };

    beforeEach(() => {
      componentUnderTest = new HomeComponent(mockCurrentUser, null, mockUiConfig, mockSearchContext,
        mockUserPreference, mockGalleryView, null, mockFilter);
    });

    describe('ngOnInit()', () => {
      it('Should call the config service for the home component config options', () => {
        componentUnderTest.ngOnInit();
        expect(mockUiConfig.get).toHaveBeenCalledWith('home');
        expect(componentUnderTest.config).toEqual(
          {
            'pageSize': { 'value': '100' },
            'notifications': { 'items': [{ 'trString': 'NOTIFICATION.NEW_USER' }] }
          });
      });
    });

    describe('buildSearchContext()', () => {
      it('Should create a new search context - anon user', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.newSearchContext('cat');
        expect(mockSearchContext.new).toHaveBeenCalledWith({ q: 'cat', i: 1, n: '100', sortId: 0 });
        expect(mockFilter.clear).toHaveBeenCalled();
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new HomeComponent(
          mockCurrentUser, null, mockUiConfig, mockSearchContext, mockUserPreference, mockGalleryView, null, mockFilter);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
}
