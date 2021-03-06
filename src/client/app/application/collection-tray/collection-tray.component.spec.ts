import { Observable } from 'rxjs/Observable';
import { CollectionTrayComponent } from './collection-tray.component';
import { CollectionFormComponent } from './components/collection-form.component';
import { Asset } from '../../shared/interfaces/common.interface';
import * as EnhancedMock from '../../shared/interfaces/enhanced-asset';
import { mockAsset } from '../../shared/mocks/mock-asset';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Collection Tray Component', () => {
    let componentUnderTest: CollectionTrayComponent;
    let mockEnhancedAsset: EnhancedMock.EnhancedAsset;
    let mockAppStore: MockAppStore;
    let mockDialogService: any;
    let navigateDispatchSpy: jasmine.Spy;

    beforeEach(() => {
      mockEnhancedAsset = EnhancedMock.enhanceAsset(mockAsset, 'collectionAsset');

      mockAppStore = new MockAppStore();
      mockAppStore.createStateSection('uiConfig', {
        components: {
          global: { config: { pageSize: { value: 10 } } },
          collection: { config: { some: 'config' } }
        }
      });
      navigateDispatchSpy = mockAppStore.createActionFactoryMethod('router', 'goToCollection');
      mockAppStore.createActionFactoryMethod('activeCollection', 'loadIfNeeded');

      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog').and.callFake((_: any) => {
          mockDialogService.onSubmitCallback = _.outputOptions[0].callback;
        })
      };

      componentUnderTest = new CollectionTrayComponent(mockDialogService, mockAppStore);

      componentUnderTest.collection = { assets: { items: [EnhancedMock.enhanceAsset(mockAsset, 'collectionAsset')] } } as any;
    });

    describe('hasId()', () => {
      it('returns true when the asset exists and has an id', () => {
        expect(componentUnderTest.hasId({ assetId: 47 } as EnhancedMock.EnhancedAsset)).toBe(true);
      });

      it('returns false when the asset is undefined', () => {
        expect(componentUnderTest.hasId(undefined)).toBe(false);
      });

      it('returns false when the asset is null', () => {
        expect(componentUnderTest.hasId(null)).toBe(false);
      });

      it('returns false when the asset doesn\'t have an id', () => {
        expect(componentUnderTest.hasId({} as EnhancedMock.EnhancedAsset)).toBe(false);
      });
    });

    describe('routerLinkFor()', () => {
      it('returns the enhanced asset\'s router link array', () => {
        expect(componentUnderTest.routerLinkFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.routerLink);
      });
    });

    describe('hasThumbnail()', () => {
      it('returns true if the asset has a thumbnail URL', () => {
        expect(componentUnderTest.hasThumbnail(mockEnhancedAsset)).toBe(true);
      });
    });

    describe('thumbnailUrlFor()', () => {
      it('returns the thumbnail URL for the asset', () => {
        expect(componentUnderTest.thumbnailUrlFor(mockEnhancedAsset)).toEqual(mockEnhancedAsset.thumbnailUrl);
      });
    });

    describe('createCollection', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
        componentUnderTest.createCollection();
      });


      it('calls openComponentInDialog on the dialog service', () => {
        expect(mockDialogService.openComponentInDialog).toHaveBeenCalledWith({
          componentType: CollectionFormComponent,
          dialogConfig: { position: { top: '10%' } },
          inputOptions: {
            fields: { some: 'config' },
            collectionActionType: 'create'
          },
          outputOptions: [{
            event: 'collectionSaved',
            callback: jasmine.any(Function),
            closeOnEvent: true
          }]
        });
      });

      it('dispatches the proper action when the callback is called', () => {
        mockDialogService.onSubmitCallback({ id: 123 });

        mockAppStore.expectDispatchFor(navigateDispatchSpy, 123);
      });
    });
  });
}
