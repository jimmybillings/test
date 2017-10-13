import { Observable } from 'rxjs/Observable';
import { CollectionShowComponent } from './collection-show.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';
import { Frame } from '../../shared/modules/wazee-frame-formatter/index';

export function main() {
  describe('Collection Show Component', () => {
    let componentUnderTest: CollectionShowComponent;
    let mockStore: MockAppStore;
    let mockWindow: any;
    let mockCapabilitiesService: any;
    let mockChangeDetectorRef: any;
    let mockRoute: any;
    let getCountsSpy: jasmine.Spy;
    let mockCollectionsService: any;
    let mockDialogService: any;
    let mockRouter: any;
    let mockAsset: any;
    let handleCustomErrorSpy: jasmine.Spy;
    let snackBarDisplaySpy: jasmine.Spy;
    let canAdministerQuotes: boolean = true;
    let mockQuoteEditService: any;
    let mockDownloadcompResponse: any = {};
    let mockCartService: any;
    let mockDocumentService: any;
    let mockUserPreferenceService: any;

    beforeEach(() => {
      mockWindow = { nativeWindow: { location: { href: {} }, innerWidth: 200 } };

      mockRouter = { navigate: jasmine.createSpy('navigate') };

      mockCapabilitiesService = {
        editCollection: jasmine.createSpy('editCollection').and.returnValue(Observable.of(true)),
        administerQuotes: () => canAdministerQuotes
      };

      mockAsset = {
        downloadComp: jasmine.createSpy('downloadComp').and.returnValue(Observable.of(mockDownloadcompResponse)),
        getClipPreviewData: jasmine.createSpy('getClipPreviewData').and.returnValue(Observable.of({ url: 'test url' }))
      };

      mockChangeDetectorRef = { markForCheck: jasmine.createSpy('markForCheck') };

      mockCollectionsService = {
        getByIdAndDuplicate: jasmine.createSpy('getByIdAndDuplicate').and.returnValue(Observable.of({
          collection: {
            id: 123, assets: {
              items: [
                { id: 123, uuid: 'slkdjf-lskdjf', timeStart: 123, timeEnd: 456 },
                { id: 456, uuid: 'woieur-owisld', timeStart: -1, timeEnd: -2 }
              ]
            }
          }
        })),
        delete: jasmine.createSpy('delete').and.returnValue(Observable.of({}))
      };

      mockRoute = { params: Observable.of({ id: 1, some: 'params' }) };

      mockDialogService = {
        openComponentInDialog: jasmine.createSpy('openComponentInDialog').and.returnValue(Observable.of({}))
      };

      mockQuoteEditService = {
        addAssetToProjectInQuote: jasmine.createSpy('addAssetToProjectInQuote')
      };

      mockCartService = {
        addAssetToProjectInCart: jasmine.createSpy('addAssetToProjectInCart')
      };

      mockDocumentService = {
        body: { classList: { add: jasmine.createSpy('add'), remove: jasmine.createSpy('remove') } }
      };

      mockUserPreferenceService = {
        updateAssetViewPreference: jasmine.createSpy('updateAssetViewPreference')
      };

      mockStore = new MockAppStore();

      mockStore.createStateSection('activeCollection', {
        collection: {
          id: 123, assets: {
            items: [
              {
                assetId: 123,
                uuid: 'ABCD',
                other: 'stuff',
                timeStart: 1000,
                timeEnd: 2000,
                metadata: [{ name: 'Format.FrameRate', value: '30 fps' }]
              },
              { assetId: 456, uuid: 'EFFH', other: 'stuff', timeStart: -1, timeEnd: -2 }
            ]
          }
        }, loaded: true
      });

      mockStore.createStateSection('uiConfig', {
        components: {
          collectionComment: { config: { form: { items: [{ some: 'commentConfig' }] } } },
          collection: { config: { some: 'collectionConfig' } }
        }
      });
      mockStore.createStateSection('comment', { collection: { pagination: { totalCount: 3 } } });
      getCountsSpy = mockStore.createActionFactoryMethod('comment', 'getCounts');
      handleCustomErrorSpy = mockStore.createActionFactoryMethod('error', 'handleCustomError');
      snackBarDisplaySpy = mockStore.createActionFactoryMethod('snackbar', 'display');

      componentUnderTest = new CollectionShowComponent(
        mockCapabilitiesService, mockRouter, mockCollectionsService, mockCartService,
        mockUserPreferenceService, mockAsset, mockRoute, mockWindow, mockDialogService,
        mockQuoteEditService, mockDocumentService, mockStore, mockChangeDetectorRef
      );
    });

    describe('ngOnInit()', () => {
      describe('with a valid active collection', () => {
        beforeEach(() => {
          componentUnderTest.ngOnInit();
        });

        it('calls getCounts on the comment action factory', () => {
          expect(getCountsSpy).toHaveBeenCalled();
        });

        it('sets up the commentParentObject instance variable', () => {
          expect(componentUnderTest.commentParentObject).toEqual({ objectType: 'collection', objectId: 123 });
        });

        it('sets up the config instance vars', () => {
          expect(componentUnderTest.commentFormConfig).toEqual([{ some: 'commentConfig' }]);
          expect(componentUnderTest.newCollectionFormConfig).toEqual({ some: 'collectionConfig' });
        });
      });

      describe('with an invalid active collection (without an id)', () => {
        beforeEach(() => {
          mockStore.createStateElement('activeCollection', 'collection', { id: null });
          componentUnderTest.ngOnInit();
        });

        it('does not call getCounts on the comment action factory', () => {
          expect(getCountsSpy).not.toHaveBeenCalled();
        });

        it('does not set up the commentParentObject instance variabl', () => {
          expect(componentUnderTest.commentParentObject).toBeUndefined();
        });
      });
    });

    describe('get userCanEditCollection()', () => {
      it('should call editCollection() on the cababilities service', () => {
        componentUnderTest.ngOnInit();
        let result: Observable<boolean> = componentUnderTest.userCanEditCollection;

        result.take(1).subscribe(res => expect(res).toEqual(true));
      });
    });

    describe('toggleCommentsVisibility()', () => {
      it('should toggle the showComments flag', () => {
        componentUnderTest.showComments = false;
        componentUnderTest.toggleCommentsVisibility();
        expect(componentUnderTest.showComments).toBe(true);
        componentUnderTest.toggleCommentsVisibility();
        expect(componentUnderTest.showComments).toBe(false);
      });
    });

    describe('commentCounts getter', () => {
      it('selects the right part of the store', () => {
        let count: number;
        componentUnderTest.commentCount.subscribe(c => count = c);
        expect(count).toBe(3);
      });
    });

    describe('editCollection()', () => {

      it('Should call the dialog service to open the edit collection form in a dialog', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.editCollection();
        expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
      });
    });

    describe('duplicateCollection()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
        componentUnderTest.duplicateCollection();
      });

      it('Should call the collection end point with the correct ID', () => {
        expect(mockCollectionsService.getByIdAndDuplicate).toHaveBeenCalledWith(123);
      });

      it('Should call the dialog service to open the duplicate collection form in a dialog', () => {
        expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
      });
    });

    describe('changePage()', () => {
      it('Should navigate to the correct page', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.changePage(3);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/collections/123', { some: 'params', i: 3 }]);
      });

    });

    describe('downloadComp()', () => {
      beforeEach(() => { mockDownloadcompResponse = { url: 'test url' }; });
      it('Should call the api to download a comp with correct assetId and comp type', () => {

        componentUnderTest.downloadComp({ assetId: 1, compType: 'comp' });
        expect(mockAsset.downloadComp).toHaveBeenCalledWith(1, 'comp');
      });

      it('Should update the location url if one exists in the response', () => {

        componentUnderTest.downloadComp({ assetId: 1, compType: 'comp' });
        expect(mockWindow.nativeWindow.location.href).toEqual('test url');
      });

      it('Should throw a custom error if there is no url in the response', () => {
        mockDownloadcompResponse = {};
        mockAsset = {
          downloadComp: jasmine.createSpy('downloadComp').and.returnValue(Observable.of(mockDownloadcompResponse))
        };
        componentUnderTest = new CollectionShowComponent(
          mockCapabilitiesService, mockRouter, mockCollectionsService, null, null,
          mockAsset, mockRoute, mockWindow, mockDialogService, null, null, mockStore, mockChangeDetectorRef
        );

        componentUnderTest.downloadComp({ assetId: 1, compType: 'comp' });
        expect(handleCustomErrorSpy).toHaveBeenCalledWith('COMPS.NO_COMP');
      });

    });

    describe('setCollectionForDelete()', () => {
      it('Should open the dialog to confirm delete of collection', () => {
        componentUnderTest.setCollectionForDelete();
        expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
      });
    });

    describe('deleteCollection()', () => {

      it('Should navigate to the collections url', () => {
        componentUnderTest.deleteCollection(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/collections']);
      });

      it('Should call the api with the correct collection id paramter to delete', () => {
        componentUnderTest.deleteCollection(1);
        expect(mockCollectionsService.delete).toHaveBeenCalledWith(1);
      });

      it('Should display a success toast when a collection has been succesfully completed', () => {
        componentUnderTest.deleteCollection(1);
        expect(snackBarDisplaySpy).toHaveBeenCalledWith('COLLECTION.INDEX.DELETE_SUCCESS_TOAST');
      });
    });

    describe('addAssetToCartOrQuote()', () => {
      it('Should add an asset to Quote if user has administerQuotes permission', () => {
        componentUnderTest.addAssetToCartOrQuote({ assetId: 123, name: 'test asset' });
        expect(mockQuoteEditService.addAssetToProjectInQuote).toHaveBeenCalledWith(
          { lineItem: { asset: { assetId: 123, name: 'test asset' } } });
      });

      it('Should display a snack bar with the correct string and asset name for add to quote', () => {
        componentUnderTest.addAssetToCartOrQuote({ assetId: 123, name: 'test asset' });
        expect(snackBarDisplaySpy).toHaveBeenCalledWith('ASSET.ADD_TO_QUOTE_TOAST', { assetId: 'test asset' });
      });

      it('Should add an asset to Cart if user does not have administerQuotes permission', () => {
        canAdministerQuotes = false;
        componentUnderTest.addAssetToCartOrQuote({ assetId: 123, name: 'test asset' });
        expect(mockCartService.addAssetToProjectInCart).toHaveBeenCalledWith(
          { lineItem: { asset: { assetId: 123, name: 'test asset' } } });
      });

      it('Should display a snack bar with the correct string and asset name for add to quote', () => {
        canAdministerQuotes = false;
        componentUnderTest.addAssetToCartOrQuote({ assetId: 123, name: 'test asset' });
        expect(snackBarDisplaySpy).toHaveBeenCalledWith('ASSET.ADD_TO_CART_TOAST', { assetId: 'test asset' });
      });
    });

    describe('getAssetsForLink()', () => {
      it('Should call the dialog service to open the collection link dialog', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.getAssetsForLink();
        expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
      });
    });

    describe('editAsset', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('calls the api to get clip preview data with the correct asset id', () => {
        componentUnderTest.editAsset({ assetId: 123, name: 'test asset' } as any);
        expect(mockAsset.getClipPreviewData).toHaveBeenCalledWith(123);
      });

      it('updates the document body with a new class', () => {
        componentUnderTest.editAsset({ assetId: 123, name: 'test asset' } as any);
        expect(mockDocumentService.body.classList.add).toHaveBeenCalledWith('subclipping-edit-open');
      });

      it('opens a dialog to edit the asset inside', () => {
        componentUnderTest.editAsset({ assetId: 123, name: 'test asset' } as any);
        expect(mockDialogService.openComponentInDialog).toHaveBeenCalled();
      });

      it('sends a list of already used markers for the asset in the active collection', () => {
        componentUnderTest.editAsset({ assetId: 123, name: 'test asset' } as any);

        // TODO: Test other arguments to this function.
        expect(mockDialogService.openComponentInDialog.calls.mostRecent().args[0].inputOptions.alreadyUsedMarkersList)
          .toEqual([{ in: new Frame(30).setFromFrameNumber(30), out: new Frame(30).setFromFrameNumber(60) }]);
      });

      it('removes the document body with class added in the beginning', () => {
        componentUnderTest.editAsset({ assetId: 123, name: 'test asset' } as any);
        expect(mockDocumentService.body.classList.remove).toHaveBeenCalledWith('subclipping-edit-open');
      });
    });

    describe('onChangeAssetView()', () => {
      it('Should call the userPreference service to update the asset view preference', () => {
        componentUnderTest.onChangeAssetView('grid');
        expect(mockUserPreferenceService.updateAssetViewPreference).toHaveBeenCalledWith('grid');
      });
    });
  });
}
