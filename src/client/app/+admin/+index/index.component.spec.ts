import { IndexComponent } from './index.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Admin Index Component', () => {
    let componentUnderTest: IndexComponent;

    const mockCurrentUser: any = null;
    const mockAdminService: any = {
      getResourceIndex: jasmine.createSpy('getResourceIndex').and.callFake(fakeGetResourceIndex)
    };
    const mockRoute: any = {
      params: Observable.of({ i: '1', n: '10', s: 'id', d: 'false', fields: 'firstName', values: 'ross' }),
      snapshot: { url: [{}, { path: 'user' }] }
    };
    const mockUiConfig: any = {
      get: jasmine.createSpy('set').and.callFake(fakeUiGet)
    };
    const mockUiState: any = null;
    const mockRouter: any = {
      navigate: jasmine.createSpy('navigate').and.callFake(fakeNavigate)
    };

    function fakeUiGet(configPiece: string) { return Observable.of({ config: `${configPiece} Config` }); }

    function fakeGetResourceIndex(params: any, resourceType: string) { return; }

    function fakeNavigate(params: any) { return; }

    beforeEach(() => {
      componentUnderTest = new IndexComponent(mockCurrentUser, mockAdminService, mockRoute, mockUiConfig, mockUiState, mockRouter);
    });

    describe('Initialization', () => {
      it('creates a subscription', () => {
        spyOn(componentUnderTest, 'routeChanges');
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.routeChanges).toHaveBeenCalled();
      });
    });

    describe('routeChanges()', () => {
      it('sets vars', () => {
        componentUnderTest.routeChanges();

        expect(componentUnderTest.toggleFlag).toBe('false');
        expect(componentUnderTest.resourceType).toBe('user');
        expect(componentUnderTest.currentComponent).toBe('User');
        expect(componentUnderTest.config).toBe('adminUser Config');
      });

      it('calls buildRouteParams()', () => {
        spyOn(componentUnderTest, 'buildRouteParams');
        componentUnderTest.routeChanges();

        expect(componentUnderTest.buildRouteParams).toHaveBeenCalledWith(
          { i: '1', n: '10', s: 'id', d: 'false', fields: 'firstName', values: 'ross' });
      });
    });

    describe('getIndex', () => {
      it('calls the adminService', () => {
        componentUnderTest.routeChanges();
        componentUnderTest.getIndex();

        expect(mockAdminService.getResourceIndex).toHaveBeenCalledWith(
          { i: '1', n: '10', s: 'id', d: 'false', fields: 'firstName', values: 'ross' }, 'user');
      });
    });

    describe('navigateToPageUrl', () => {
      it('should navigate to a url with a new page number', () => {
        componentUnderTest.params = { i: '1', n: '10', s: 'id', d: 'false', fields: 'firstName', values: 'ross' };
        componentUnderTest.resourceType = 'user';
        componentUnderTest.navigateToPageUrl('5');

        expect(mockRouter.navigate).toHaveBeenCalledWith(
          ['/admin/resource/user', { i: '5', n: '10', s: 'id', d: 'false', fields: 'firstName', values: 'ross' }]);
      });
    });
  });
}