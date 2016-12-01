
import { Observable } from 'rxjs/Rx';
import { HomeComponent } from './home.component';

export function main() {
  describe('Home Component', () => {
    let componentUnderTest: HomeComponent;
    let mockUiConfig: any, mockSearchContext: any, mockUserPreference: any, mockFilter: any;
    mockUiConfig = { get: jasmine.createSpy('get').and.returnValue(Observable.of({ 'config': { 'pageSize': { 'value': '100' }, 'notifications': { 'items': [{ 'trString': 'NOTIFICATION.NEW_USER' }] } } })) };
    mockSearchContext = { new: jasmine.createSpy('new') };
    mockUserPreference = { state: { sortId: 0 } };
    mockFilter = { set: jasmine.createSpy('set'), clear: jasmine.createSpy('clear') };

    beforeEach(() => {
      componentUnderTest = new HomeComponent(null, null, mockUiConfig, mockSearchContext, mockUserPreference, mockFilter);
    });

    describe('ngOnInit()', () => {
      it('Should call the config service for the home component config options', () => {
        componentUnderTest.ngOnInit();
        expect(mockUiConfig.get).toHaveBeenCalledWith('home');
        expect(componentUnderTest.config).toEqual({ 'pageSize': { 'value': '100' }, 'notifications': { 'items': [{ 'trString': 'NOTIFICATION.NEW_USER' }] } });
      });
    });

    describe('buildSearchContext()', () => {
      it('Should create a new search context - anon user', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.newSearchContext('cat');
        expect(mockSearchContext.new).toHaveBeenCalledWith({ q: 'cat', i: 1, n: '100', sortId: 0 });
        expect(mockFilter.set).toHaveBeenCalledWith(mockFilter.clear());
      });

      it('Should remove any empty properties in the configurable search params incase HUMANS forgot to put them in there', () => {
        expect(componentUnderTest.buildSearchContext(JSON.stringify({ q: '', i: 0, n: 100 }))).toEqual({ i: 0, n: 100 });
      });
    });

    describe('ngOnDestroy()', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };
        componentUnderTest = new HomeComponent(null, null, mockUiConfig, mockSearchContext, mockUserPreference, mockFilter);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
}
