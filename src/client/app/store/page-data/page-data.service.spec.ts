import { Observable } from 'rxjs/Observable';
import { PageDataService } from './page-data.service';

export function main() {
  describe('Page Data Service', () => {
    let serviceUnderTest: PageDataService;
    let mockTranslateService: any;
    let mockTitleService: any;

    beforeEach(() => {
      mockTranslateService = {
        get: (key: string, params: any) => Observable.of('some value')
      };
      mockTitleService = {
        setTitle: jasmine.createSpy('setTitle')
      };
      serviceUnderTest = new PageDataService(mockTranslateService, mockTitleService);
    });

    describe('updateTitle()', () => {
      it('calls translateService::setTitle with the proper value', () => {
        serviceUnderTest.updateTitle('ross', { some: 'params' });

        expect(mockTitleService.setTitle).toHaveBeenCalledWith('some valuesome value');
      });
    });
  });
}
