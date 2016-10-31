import { ConfigComponent } from './config.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Config Component', () => {
    let componentUnderTest: ConfigComponent;
    let mockConfigService: any;
    let mockUiConfig: any;
    let mockRouter: any;

    let mockUi: any = [{ uiOne: 'one' }, { uiTwo: 'two' }, { uiThree: 'three' }];
    let mockSite: any = [{ siteOne: 'one' }, { siteTwo: 'two' }, { siteThree: 'three' }];

    function mockGet(configPiece: string): Observable<any> {
      return Observable.of({ config: { tableHeaders: { items: ['one', 'two', 'three'] } } });
    }

    beforeEach(() => {
      mockConfigService = { getUiConfigIndex: () => Observable.of(mockUi), getSiteConfigIndex: () => Observable.of(mockSite) };
      mockUiConfig = { get: jasmine.createSpy('get').and.callFake(mockGet) };
      mockRouter = { navigate: () => { return true; } };

      componentUnderTest = new ConfigComponent(mockUiConfig, mockConfigService, mockRouter);
    });

    describe('Initialization', () => {
      it('should call the uiConfig service get() method properly', () => {
        componentUnderTest.ngOnInit();

        expect(mockUiConfig.get).toHaveBeenCalledWith('configuration');
        expect(componentUnderTest.headers).toEqual(['one', 'two', 'three']);
        expect(componentUnderTest.uiConfigs).toEqual(Observable.of(mockUi));
        expect(componentUnderTest.siteConfigs).toEqual(Observable.of(mockSite));
      });
    });
  });
}