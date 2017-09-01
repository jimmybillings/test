import { HomeResolver } from './home.resolver';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Home Resolver', () => {
    let resolverUnderTest: HomeResolver;
    let mockUiConfig: any;

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
    beforeEach(() => {
      resolverUnderTest = new HomeResolver(null, mockUiConfig, null);
    });

    it('***** HASN\'T BEEN TESTED YET! *****', () => {
      expect(true).toBe(true);
    });
  });
}
