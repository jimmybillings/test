import { AdminIndexResolver } from './admin-index.resolver';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Admin Index Resolver', () => {
    let resolverUnderTest: AdminIndexResolver;
    let mockAdminService: any;
    const mockRoute: any = { url: [{ path: 'admin' }, { path: 'user' }], params: { i: '1', n: '10', s: 'id', d: 'false' } };
    const mockState: any = undefined;

    function getIndex(params: any, resource: string) {
      return Observable.of({ adminData: 'stuff' });
    }

    beforeEach(() => {
      mockAdminService = { getResourceIndex: jasmine.createSpy('getResourceIndex').and.callFake(getIndex) };
      resolverUnderTest = new AdminIndexResolver(mockAdminService);
    });

    it('resolves', () => {
      resolverUnderTest.resolve(mockRoute, mockState);

      expect(mockAdminService.getResourceIndex).toHaveBeenCalledWith({ i: '1', n: '10', s: 'id', d: 'false' }, 'user');
    });
  });
}