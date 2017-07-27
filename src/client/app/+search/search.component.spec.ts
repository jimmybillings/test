import { SearchComponent } from './search.component';
import { Observable } from 'rxjs/Observable';

export function main() {
  describe('Search Component', () => {
    let componentUnderTest: SearchComponent;
    let mockAssetData: any, mockUiConfig: any, mockUserCan: any, mockActiveCollection: any,
      mockSearchContext: any, mockFilter: any, mockUserPreferences: any, mockErrorStore: any,
      mockSortDefinition: any, mockCart: any, mockAssetService: any, mockRenderer: any,
      mockWindow: any, mockTranslate: any, mockSnackBar: any, mockRouter: any, mockActivatedRoute: any, MockRefDetecor: any;

    beforeEach(() => {
      mockAssetData = {
        clearAssets: jasmine.createSpy('clearAssets'),
        data: Observable.of([{ asset: 'mockAsset1' }, { asset: 'mockAsset2' }]),
        downloadComp: jasmine.createSpy('downloadComp').and.returnValue(
          Observable.of({ url: 'mockUrl' }))
      };
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(
          Observable.of({ config: { config: 'mockSearchConfig' } }))
      };
      mockUserCan = { administerQuotes: () => false };
      mockActiveCollection = {
        addAsset: jasmine.createSpy('addAsset').and.returnValue(Observable.of([])),
        removeAsset: jasmine.createSpy('removeAsset').and.returnValue(Observable.of([])),
        state: { name: 'testCollection' }
      };
      mockSearchContext = {
        update: null,
        go: jasmine.createSpy('go'),
        remove: jasmine.createSpy('remove'),
        state: {
          q: 'cat', i: 7, n: 100, sortId: 23, filterIds: '1517',
          filterValues: '1517:2015-12-10 - 2016-12-12'
        }
      };
      mockFilter = {
        load: jasmine.createSpy('load').and.returnValue(Observable.of([])),
        set: jasmine.createSpy('set'),
        active: jasmine.createSpy('active'),
        toggle: jasmine.createSpy('toggle'),
        getActive: jasmine.createSpy('getActive').and.returnValue(
          { filters: [{ filterId: 1 }, { filterId: 2 }, { filterId: 3, filterValue: 'Cat' }], ids: [1, 2, 3], values: ['Cat'] }),
        addCustom: jasmine.createSpy('addCustom'),
        toggleExclusive: jasmine.createSpy('toggleExclusive'),
        clear: jasmine.createSpy('clear'),
        toggleFilterGroup: jasmine.createSpy('toggleFilterGroup')
      };
      mockUserPreferences = {
        data: Observable.of({ displayFilterCounts: false, displayFilterTree: true }),
        toggleFilterCount: jasmine.createSpy('toggleFilterCount'),
        openCollectionTray: jasmine.createSpy('openCollectionTray'),
        updateSortPreference: jasmine.createSpy('updateSortPreference'),
        state: { displayFilterCounts: false, displayFilterTree: true },
        updateAssetViewPreference: jasmine.createSpy('updateAssetViewPreference')
      };
      mockErrorStore = { dispatch: jasmine.createSpy('dispatch') };
      mockSortDefinition = {
        updateSortPreference: jasmine.createSpy('updateSortPreference'),
        update: jasmine.createSpy('update'),
        data: Observable.of({ currentSort: 'mockSort' })
      };
      mockCart = {
        addAssetToProjectInCart: jasmine.createSpy('addAssetToProjectInCart')
      };
      mockAssetService = {
        getSpeedviewData: jasmine.createSpy('getSpeedviewData').and.returnValue(Observable.of([]))
      };
      mockRenderer = {
        listenGlobal: jasmine.createSpy('listenGlobal')
          .and.callFake((a: any, b: any, c: Function) => { c(); })
      };
      mockWindow = {
        nativeWindow: {
          location: { href: null },
          innerWidth: 500
        }
      };
      mockTranslate = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of([]))
      };
      mockSnackBar = {
        open: () => { }
      };
      mockActivatedRoute = {
        snapshot: {
          params: {
            gq: '[{"ids":[13,18],"names":["press packet","day 04"]},{"ids":[3],"names":["adam scott"]}]',
            n: 1,
            i: 100
          }
        }
      };
      mockRouter = {
        navigate: jasmine.createSpy('navigate'),
        events: Observable.of({})
      };
      MockRefDetecor = {
        markForCheck: () => { return true; }
      };
      componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter, mockCart,
        mockAssetService, mockSortDefinition, mockErrorStore, mockSearchContext, mockUiConfig, mockAssetData,
        mockUserPreferences, mockRenderer, mockWindow, mockSnackBar, mockTranslate, mockActivatedRoute, mockRouter, MockRefDetecor, null);
    });

    describe('contrustor()', () => {
      it('should not set the path if the "gq" parameter doesn\'t exist', () => {
        mockActivatedRoute = { snapshot: { params: { i: 1, n: 100 } } };
        componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter, mockCart,
          mockAssetService, mockSortDefinition, mockErrorStore, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow, mockSnackBar, mockTranslate, mockActivatedRoute, mockRouter, MockRefDetecor, null);

        expect(componentUnderTest.path).toEqual('');
      });

      it('should set the path if there is a "gq" parameter', () => {

        expect(componentUnderTest.path).toEqual([
          { 'ids': [13, 18], 'names': ['press packet', 'day 04'] },
          { 'ids': [3], 'names': ['adam scott'] }
        ]);
      });
    });

    describe('onCLickBreadcrumb()', () => {
      it('should append to the path and call router.navigate()', () => {
        componentUnderTest.path = [
          { 'ids': [13, 18], 'names': ['press packet', 'day 04'] },
          { 'ids': [3], 'names': ['adam scott'] }
        ];
        componentUnderTest.onClickBreadcrumb(1);

        expect(mockRouter.navigate).toHaveBeenCalledWith([
          '/gallery-view',
          { path: '[{"ids":[13,18],"names":["press packet","day 04"]}]' }
        ]);
      });
    });

    describe('onresize()', () => {
      it('Should set the screen size variable when screen size change', () => {
        mockWindow.nativeWindow.onresize();
        expect(componentUnderTest.screenWidth).toBe(500);
      });
    });

    describe('ngOnDestroy()', () => {
      it('Should show reset the asset store when the component is destroyed', () => {
        componentUnderTest.ngOnDestroy();
        expect(mockAssetData.clearAssets).toHaveBeenCalled();
      });
    });

    describe('countToggle()', () => {
      it('Should call the filter service get with the search context state and the opposite boolean value' +
        +' of the current displayFilterCounts boolean', () => {
          componentUnderTest.countToggle();
          expect(componentUnderTest.filter.load).toHaveBeenCalledWith(
            { q: 'cat', i: 7, n: 100, sortId: 23, filterIds: '1517', filterValues: '1517:2015-12-10 - 2016-12-12' },
            true
          );
        });

      it('Should call the user preference service to toggle the filter count boolean', () => {
        componentUnderTest.countToggle();
        expect(mockUserPreferences.toggleFilterCount).toHaveBeenCalled();
      });
    });

    describe('addToCollection()', () => {
      it('Should call the user prefence service to save the collection tray flag as true', () => {
        componentUnderTest.addToCollection({ collection: { id: 1 }, asset: 'mockAsset' });
        expect(mockUserPreferences.openCollectionTray).toHaveBeenCalled();
      });

      it('Should call the active collection addAsset method with collection id and asset', () => {
        componentUnderTest.addToCollection({ collection: { id: 1 }, asset: 'mockAsset' });
        expect(componentUnderTest.activeCollection.addAsset).toHaveBeenCalledWith(1, 'mockAsset');
      });
    });

    describe('removeFromCollection()', () => {
      it('Should call the user prefence service to save the collection tray flag as true', () => {
        componentUnderTest.removeFromCollection({ collection: { id: 1 }, asset: 'mockAsset' });
        expect(mockUserPreferences.openCollectionTray).toHaveBeenCalled();
      });

      it('Should call the active collection removeAsset method with collection id and asset', () => {
        componentUnderTest.removeFromCollection({ collection: { id: 1 }, asset: 'mockAsset' });
        expect(componentUnderTest.activeCollection.removeAsset).toHaveBeenCalledWith(
          { collection: { id: 1 }, asset: 'mockAsset' });
      });
    });

    describe('changePage()', () => {
      it('Should call the update setter on search context to update the search context state', () => {
        componentUnderTest.changePage(1);
        expect(mockSearchContext.update).toEqual({ i: 1 });
      });

      it('Should call the go method on searchContext', () => {
        componentUnderTest.changePage(1);
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

    describe('filterEvent()', () => {
      it('Should call the filter service with a filter id to toggle its boolean on/off value', () => {
        componentUnderTest.filterEvent({ event: 'toggleFilter', filter: { filterId: 1 } });
        expect(componentUnderTest.filter.toggle).toHaveBeenCalledWith(1);
        expect(mockSearchContext.go).toHaveBeenCalled();
      });

      it('Should call the filter service to toggle a filter group to show/hide', () => {
        componentUnderTest.filterEvent({ event: 'toggleFilterGroup', filter: { filterId: 1 } });
        expect(componentUnderTest.filter.toggleFilterGroup).toHaveBeenCalledWith({ filterId: 1 });
      });

      it('Should call the filter service to apply an exculsive filter', () => {
        componentUnderTest.filterEvent({ event: 'applyExclusiveFilter', filter: { filterId: 1 } });
        expect(componentUnderTest.filter.toggleExclusive).toHaveBeenCalledWith({ filterId: 1 });
        expect(mockSearchContext.go).toHaveBeenCalled();
      });

      it('Should call the filter service to apply a custom value on a filter', () => {
        componentUnderTest.filterEvent(
          { event: 'applyCustomValue', filter: { filterId: 1 }, customValue: 'mockCustomValue' }
        );
        expect(componentUnderTest.filter.addCustom).toHaveBeenCalledWith({ filterId: 1 }, 'mockCustomValue');
        expect(mockSearchContext.go).toHaveBeenCalled();
      });

      it('Should call the filter service to clear all filters / reset', () => {
        componentUnderTest.filterEvent({ event: 'clearFilters', filter: { filterId: 1 } });
        expect(componentUnderTest.filter.clear).toHaveBeenCalled();
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

    describe('downloadComp()', () => {
      it('Should call the asset service to download a comp with an assetId and comp type', () => {
        componentUnderTest.downloadComp({ assetId: 3, compType: 'small' });
        expect(mockAssetData.downloadComp).toHaveBeenCalledWith(3, 'small');
      });

      it('Should set the browser url to be the url in the response from the downloadComp method', () => {
        componentUnderTest.downloadComp({ assetId: 3, compType: 'small' });
        expect(mockWindow.nativeWindow.location.href).toEqual('mockUrl');
      });

      it('Should create a notification if the response doesnt include a url', () => {
        mockAssetData = {
          clearAssets: jasmine.createSpy('clearAssets'),
          data: Observable.of([{ asset: 'mockAsset1' }, { asset: 'mockAsset2' }]),
          downloadComp: jasmine.createSpy('downloadComp').and.returnValue(Observable.of({}))
        };
        componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter,
          mockCart, mockAssetService, mockSortDefinition, mockErrorStore, mockSearchContext,
          mockUiConfig, mockAssetData, mockUserPreferences, mockRenderer, mockWindow, null, null,
          mockActivatedRoute, mockRouter, MockRefDetecor, null);
        componentUnderTest.downloadComp({ assetId: 3, compType: 'small' });
        expect(mockErrorStore.dispatch).toHaveBeenCalledWith({ status: 'COMPS.NO_COMP' });
      });
    });

    describe('onSortResults()', () => {
      it('Should call the user preference service to update the user sort preference', () => {
        componentUnderTest.sortResults({ id: 'sortByDate' });
        expect(mockUserPreferences.updateSortPreference).toHaveBeenCalledWith('sortByDate');
      });

      it('Should call sort definition service to update with new sort', () => {
        componentUnderTest.sortResults({ id: 'sortByDate' });
        expect(mockSortDefinition.update).toHaveBeenCalledWith({ currentSort: { id: 'sortByDate' } });
      });

      it('Should call the search context service to update the store with the new sort preference for the url', () => {
        componentUnderTest.sortResults({ id: 'sortByDate' });
        expect(mockSearchContext.update).toEqual({ 'i': 1, 'sortId': 'sortByDate' });
      });

      it('Should call the search context service to exectue and new browser url', () => {
        componentUnderTest.sortResults({ id: 'sortByDate' });
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

    describe('changeAssetView()', () => {
      it('Should update user preference when new view type is selected', () => {
        componentUnderTest.changeAssetView('list');
        expect(mockUserPreferences.updateAssetViewPreference).toHaveBeenCalledWith('list');
      });
    });

    describe('addAssetToCart()', () => {
      it('Should call the cart summary service to add an asset to the cart', () => {
        componentUnderTest.addAssetToCart({ assetId: 'mockId' });
        expect(mockCart.addAssetToProjectInCart).toHaveBeenCalledWith({ lineItem: { asset: { assetId: 'mockId' } } });
      });
    });

    describe('showSpeedview()', () => {
      let mockSpeedview: any;

      beforeEach(() => {
        mockSpeedview = {
          show: jasmine.createSpy('show').and.returnValue(Promise.resolve()),
          destroy: jasmine.createSpy('destroy').and.returnValue(Promise.resolve())
        };
      });

      it('when speedview data has been cached already so not call the server for it', () => {
        componentUnderTest.wzSpeedview = mockSpeedview;
        componentUnderTest.showSpeedview({ asset: { speedviewData: 'mockSpeedViewData' }, position: 'mockPosition' } as any);
        expect(mockAssetService.getSpeedviewData).not.toHaveBeenCalled();
      });

      it('Should show speedview with cached data', () => {
        componentUnderTest.wzSpeedview = mockSpeedview;
        componentUnderTest.showSpeedview({ asset: { speedviewData: 'mockSpeedViewData' }, position: 'mockPosition' } as any);
        expect(mockAssetService.getSpeedviewData).not.toHaveBeenCalled();
        expect(componentUnderTest.wzSpeedview.show).toHaveBeenCalled();
      });

      it('Should call the asset service to request speedview data from api', () => {
        componentUnderTest.wzSpeedview = mockSpeedview;
        componentUnderTest.showSpeedview({ asset: { assetId: 'mockAssetId' }, position: 'mockPosition' } as any);
        expect(mockAssetService.getSpeedviewData).toHaveBeenCalledWith('mockAssetId');
      });

      it('Should set up a window scoll listener to destory speedview on scroll', () => {
        componentUnderTest.wzSpeedview = mockSpeedview;
        componentUnderTest.showSpeedview({ asset: { assetId: 'mockAssetId' }, position: 'mockPosition' } as any);
        expect(mockRenderer.listenGlobal).toHaveBeenCalledWith('document', 'scroll', jasmine.any(Function));
      });
    });

    describe('hideSpeedview()', () => {
      it('Should call destroy on the speedview component', () => {
        componentUnderTest.wzSpeedview = { destroy: jasmine.createSpy('destroy') } as any;
        componentUnderTest.hideSpeedview();
        expect(componentUnderTest.wzSpeedview.destroy).toHaveBeenCalled();
      });
    });

    describe('filterAssets()', () => {
      it('Should reset the page number to page 1', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: [] });
        componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter, mockCart, mockAssetService,
          mockSortDefinition, mockErrorStore, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow, null, null, mockActivatedRoute, mockRouter, MockRefDetecor, null);
        componentUnderTest.filterEvent({ event: 'clearFilters', filter: { filterId: 1 } });
        expect(mockSearchContext.update).toEqual({ i: 1 });
      });

      it('Should update the search context with the filter ids', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [1, 2, 3], values: [] });
        componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter, mockCart, mockAssetService,
          mockSortDefinition, mockErrorStore, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow, null, null, mockActivatedRoute, mockRouter, MockRefDetecor, null);
        componentUnderTest.filterEvent({ event: 'clearFilters', filter: { filterId: 1 } });
        expect(mockSearchContext.update).toEqual({ 'filterIds': '1,2,3' });
      });

      it('Should remove the filterIds from the search context', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: ['cat', 'dog'] });
        componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter, mockCart, mockAssetService,
          mockSortDefinition, mockErrorStore, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow, null, null, mockActivatedRoute, mockRouter, MockRefDetecor, null);
        componentUnderTest.filterEvent({ event: 'clearFilters', filter: { filterId: 1 } });
        expect(mockSearchContext.remove).toEqual('filterIds');
      });

      it('Should update the search context with the filter values', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: ['cat', 'dog'] });
        componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter, mockCart,
          mockAssetService, mockSortDefinition, mockErrorStore, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow, null, null, mockActivatedRoute, mockRouter, MockRefDetecor, null);
        componentUnderTest.filterEvent({ event: 'clearFilters', filter: { filterId: 1 } });
        expect(mockSearchContext.update).toEqual({ 'filterValues': 'cat,dog' });
      });

      it('Should remove the filterValues from the search context', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: [] });
        componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter, mockCart, mockAssetService,
          mockSortDefinition, mockErrorStore, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow, null, null, mockActivatedRoute, mockRouter, MockRefDetecor, null);
        componentUnderTest.filterEvent({ event: 'clearFilters', filter: { filterId: 1 } });
        expect(mockSearchContext.remove).toEqual('filterValues');
      });

      it('Should call go on search context when it has filtered the assets', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: [] });
        componentUnderTest = new SearchComponent(null, mockUserCan, mockActiveCollection, mockFilter, mockCart,
          mockAssetService, mockSortDefinition, mockErrorStore, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow, null, null, mockActivatedRoute, mockRouter, MockRefDetecor, null);
        componentUnderTest.filterEvent({ event: 'clearFilters', filter: { filterId: 1 } });
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

  });
}

