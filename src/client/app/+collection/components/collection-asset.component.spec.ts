import { Observable } from 'rxjs/Observable';
import { CollectionAssetComponent } from './collection-asset.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Collection Asset Component', () => {
    let componentUnderTest: CollectionAssetComponent;
    let mockAppStore: MockAppStore;
    let mockUiConfig: any;

    beforeEach(() => {
      mockAppStore = new MockAppStore();
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: [{ some: 'field' }] } } }))
      };
      componentUnderTest = new CollectionAssetComponent(mockAppStore, mockUiConfig);
    });

    describe('ngOnInit()', () => {
      it('gets the right ui config', () => {
        componentUnderTest.ngOnInit();

        expect(mockUiConfig.get).toHaveBeenCalledWith('collectionComment');
        expect(componentUnderTest.commentFormConfig).toEqual([{ some: 'field' }]);
      });
    });
  });
}
