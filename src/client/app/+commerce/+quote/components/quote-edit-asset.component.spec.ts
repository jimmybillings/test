import { QuoteEditAssetComponent } from './quote-edit-asset.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Quote Edit Asset Component', () => {
    let componentUnderTest: QuoteEditAssetComponent;
    let mockAppStore: MockAppStore;
    let mockUiConfig: any;

    beforeEach(() => {
      mockAppStore = new MockAppStore();
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: [{ some: 'field' }] } } }))
      };
      componentUnderTest = new QuoteEditAssetComponent(mockAppStore, mockUiConfig);
    });

    describe('ngOnInit()', () => {
      it('gets the right ui config', () => {
        componentUnderTest.ngOnInit();

        expect(mockUiConfig.get).toHaveBeenCalledWith('quoteComment');
        expect(componentUnderTest.commentFormConfig).toEqual([{ some: 'field' }]);
      });
    });
  });
}

