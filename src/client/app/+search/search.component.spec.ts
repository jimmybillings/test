import { SearchComponent } from './search.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Search Component', () => {
    let componentUnderTest: SearchComponent;
    let mockAssetData: any, mockUiConfig: any, mockUserCan: any, mockActiveCollection: any,
      mockSearchContext: any, mockFilter: any, mockUserPreferences: any, mockNotification: any,
      mockSortDefinition: any, mockCart: any, mockAssetService: any, mockRenderer: any,
      mockWindow: any;

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
      mockUserCan = null;
      mockActiveCollection = {
        addAsset: jasmine.createSpy('addAsset').and.returnValue(Observable.of([])),
        removeAsset: jasmine.createSpy('removeAsset').and.returnValue(Observable.of([]))
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
        clear: jasmine.createSpy('clear')
      };
      mockUserPreferences = {
        data: Observable.of({ displayFilterCounts: false, displayFilterTree: true }),
        toggleFilterCount: jasmine.createSpy('toggleFilterCount'),
        openCollectionTray: jasmine.createSpy('openCollectionTray'),
        updateSortPreference: jasmine.createSpy('updateSortPreference'),
        state: { displayFilterCounts: false, displayFilterTree: true }
      };
      mockNotification = { create: jasmine.createSpy('create') };
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
      mockWindow = { location: { href: null } };
      componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter, mockCart,
        mockAssetService, mockSortDefinition, mockNotification, mockSearchContext, mockUiConfig, mockAssetData,
        mockUserPreferences, mockRenderer, mockWindow);
      componentUnderTest.sidenav = { open: jasmine.createSpy('open') };
    });

    describe('ngOnInit()', () => {
      it('Should open the side nav if displayFilterTree is set to true in the user preferences', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.sidenav.open).toHaveBeenCalled();
      });

      it('Should keep the side nav closed if displayFilterTree is set to false in the user preferences', () => {
        mockUserPreferences = {
          data: Observable.of({ displayFilterCounts: '20', displayFilterTree: false }),
          toggleFilterCount: jasmine.createSpy('toggleFilterCount'),
          openCollectionTray: jasmine.createSpy('openCollectionTray'),
          updateSortPreference: jasmine.createSpy('updateSortPreference'),
          state: { displayFilterCounts: false, displayFilterTree: false }
        };
        componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter,
          mockCart, mockAssetService, mockSortDefinition, mockNotification, mockSearchContext,
          mockUiConfig, mockAssetData, mockUserPreferences, mockRenderer, mockWindow);
        componentUnderTest.sidenav = { open: jasmine.createSpy('open') };
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.sidenav.open).not.toHaveBeenCalled();
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
          componentUnderTest.ngOnInit();
          componentUnderTest.countToggle();
          expect(componentUnderTest.filter.load).toHaveBeenCalledWith(
            { q: 'cat', i: 7, n: 100, sortId: 23, filterIds: '1517', filterValues: '1517:2015-12-10 - 2016-12-12' },
            true
          );
        });

      it('Should call the user preference service to toggle the filter count boolean', () => {
        componentUnderTest.ngOnInit();
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

    describe('toggleFilter()', () => {
      it('Should call the filter service with a filter id to toggle its boolean on/off value', () => {
        componentUnderTest.toggleFilter(1);
        expect(componentUnderTest.filter.toggle).toHaveBeenCalledWith(1);
      });
    });

    describe('applyFilter()', () => {
      it('Should call the filter service with a filter id to apply the filter passed in', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.applyFilter(1);
        expect(componentUnderTest.filter.toggle).toHaveBeenCalledWith(1);
      });

      it('Should filter the assets', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.applyFilter(1);
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

    describe('applyCustomValue()', () => {
      it('Should call the filter service to apply a custom value on a filter', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.applyCustomValue({ filter: 2 }, 'HD');
        expect(componentUnderTest.filter.addCustom).toHaveBeenCalledWith({ filter: 2 }, 'HD');
      });

      it('Should filter the assets', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.applyCustomValue({ filter: 2 }, 'HD');
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

    describe('applyExclusiveFilter()', () => {
      it('Should call the filter service to apply an exculsive filter', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.applyExclusiveFilter({ filter: 2 });
        expect(componentUnderTest.filter.toggleExclusive).toHaveBeenCalledWith({ filter: 2 });
      });

      it('Should filter the assets', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.applyCustomValue({ filter: 2 }, 'HD');
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

    describe('clearFilters()', () => {
      it('Should call the filter service to clear all filters / reset', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.clearFilters();
        expect(componentUnderTest.filter.clear).toHaveBeenCalled();
      });

      it('Should filter the assets', () => {
        componentUnderTest.ngOnInit();
        componentUnderTest.clearFilters();
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
        expect(mockWindow.location.href).toEqual('mockUrl');
      });

      it('Should create a notification if the response doesnt include a url', () => {
        mockAssetData = {
          clearAssets: jasmine.createSpy('clearAssets'),
          data: Observable.of([{ asset: 'mockAsset1' }, { asset: 'mockAsset2' }]),
          downloadComp: jasmine.createSpy('downloadComp').and.returnValue(Observable.of({}))
        };
        componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter,
          mockCart, mockAssetService, mockSortDefinition, mockNotification, mockSearchContext,
          mockUiConfig, mockAssetData, mockUserPreferences, mockRenderer, mockWindow);
        componentUnderTest.downloadComp({ assetId: 3, compType: 'small' });
        expect(mockNotification.create).toHaveBeenCalledWith('COMPS.NO_COMP');
      });
    });

    describe('onSortResults()', () => {
      it('Should call the user preference service to update the user sort preference', () => {
        componentUnderTest.onSortResults({ id: 'sortByDate' });
        expect(mockUserPreferences.updateSortPreference).toHaveBeenCalledWith('sortByDate');
      });

      it('Should call sort definition service to update with new sort', () => {
        componentUnderTest.onSortResults({ id: 'sortByDate' });
        expect(mockSortDefinition.update).toHaveBeenCalledWith({ currentSort: { id: 'sortByDate' } });
      });

      it('Should call the search context service to update the store with the new sort preference for the url', () => {
        componentUnderTest.onSortResults({ id: 'sortByDate' });
        expect(mockSearchContext.update).toEqual({ 'i': 1, 'sortId': 'sortByDate' });
      });

      it('Should call the search context service to exectue and new browser url', () => {
        componentUnderTest.onSortResults({ id: 'sortByDate' });
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

    describe('addAssetToCart()', () => {
      it('Should call the cart summary service to add an asset to the cart', () => {
        componentUnderTest.addAssetToCart({ asset: 'mockAsset' });
        expect(mockCart.addAssetToProjectInCart).toHaveBeenCalledWith({ asset: 'mockAsset' });
      });
    });

    describe('showSpeedview()', () => {
      it('Speedview data has been cached already so not call the server for it', () => {
        componentUnderTest.wzSpeedview = { show: jasmine.createSpy('show'), destroy: jasmine.createSpy('destroy') };
        componentUnderTest.showSpeedview({ asset: { speedviewData: 'mockSpeedViewData' }, position: 'mockPosition' });
        expect(mockAssetService.getSpeedviewData).not.toHaveBeenCalled();
      });

      it('Should show speedview with cached data', () => {
        componentUnderTest.wzSpeedview = { show: jasmine.createSpy('show'), destroy: jasmine.createSpy('destroy') };
        componentUnderTest.showSpeedview({ asset: { speedviewData: 'mockSpeedViewData' }, position: 'mockPosition' });
        expect(mockAssetService.getSpeedviewData).not.toHaveBeenCalled();
        expect(componentUnderTest.wzSpeedview.show).toHaveBeenCalled();
      });

      it('Should call the asset service to request speedview data from api', () => {
        componentUnderTest.wzSpeedview = { show: jasmine.createSpy('show'), destroy: jasmine.createSpy('destroy') };
        componentUnderTest.showSpeedview({ asset: { assetId: 'mockAssetId' }, position: 'mockPosition' });
        expect(mockAssetService.getSpeedviewData).toHaveBeenCalledWith('mockAssetId');
      });

      it('Should show speedview after calling asset service to request speedview data from api', () => {
        componentUnderTest.wzSpeedview = { show: jasmine.createSpy('show'), destroy: jasmine.createSpy('destroy') };
        componentUnderTest.showSpeedview({ asset: { assetId: 'mockAssetId' }, position: 'mockPosition' });
        componentUnderTest.speedviewData.subscribe((data: any) => {
          expect(componentUnderTest.wzSpeedview.show).toHaveBeenCalled();
        });
      });

      it('Should set up a window scoll listener to destory speedview on scroll', () => {
        componentUnderTest.wzSpeedview = { show: jasmine.createSpy('show'), destroy: jasmine.createSpy('destroy') };
        componentUnderTest.showSpeedview({ asset: { assetId: 'mockAssetId' }, position: 'mockPosition' });
        expect(mockRenderer.listenGlobal).toHaveBeenCalledWith('document', 'scroll', jasmine.any(Function));
      });
    });

    describe('hideSpeedview()', () => {
      it('Should set the speed view data variable to null', () => {
        componentUnderTest.wzSpeedview = { destroy: jasmine.createSpy('destroy') };
        componentUnderTest.hideSpeedview();
        expect(componentUnderTest.speedviewData).toEqual(null);
      });

      it('Should call destroy on the speedview component', () => {
        componentUnderTest.wzSpeedview = { destroy: jasmine.createSpy('destroy') };
        componentUnderTest.hideSpeedview();
        expect(componentUnderTest.wzSpeedview.destroy).toHaveBeenCalled();
      });
    });

    describe('filterAssets()', () => {
      it('Should reset the page number to page 1', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: [] });
        componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter, mockCart, mockAssetService,
          mockSortDefinition, mockNotification, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow);
        componentUnderTest.clearFilters();
        expect(mockSearchContext.update).toEqual({ i: 1 });
      });

      it('Should update the search context with the filter ids', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [1, 2, 3], values: [] });
        componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter, mockCart, mockAssetService,
          mockSortDefinition, mockNotification, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow);
        componentUnderTest.clearFilters();
        expect(mockSearchContext.update).toEqual({ 'filterIds': '1,2,3' });
      });

      it('Should remove the filterIds from the search context', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: ['cat', 'dog'] });
        componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter, mockCart, mockAssetService,
          mockSortDefinition, mockNotification, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow);
        componentUnderTest.clearFilters();
        expect(mockSearchContext.remove).toEqual('filterIds');
      });

      it('Should update the search context with the filter values', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: ['cat', 'dog'] });
        componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter, mockCart,
          mockAssetService, mockSortDefinition, mockNotification, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow);
        componentUnderTest.clearFilters();
        expect(mockSearchContext.update).toEqual({ 'filterValues': 'cat,dog' });
      });

      it('Should remove the filterValues from the search context', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: [] });
        componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter, mockCart, mockAssetService,
          mockSortDefinition, mockNotification, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow);
        componentUnderTest.clearFilters();
        expect(mockSearchContext.remove).toEqual('filterValues');
      });

      it('Should call go on search context when it has filtered the assets', () => {
        mockFilter.getActive = jasmine.createSpy('getActive').and.returnValue({ filters: [], ids: [], values: [] });
        componentUnderTest = new SearchComponent(mockUserCan, mockActiveCollection, mockFilter, mockCart,
          mockAssetService, mockSortDefinition, mockNotification, mockSearchContext, mockUiConfig, mockAssetData,
          mockUserPreferences, mockRenderer, mockWindow);
        componentUnderTest.clearFilters();
        expect(mockSearchContext.go).toHaveBeenCalled();
      });
    });

  });
}

