import { Observable } from 'rxjs/Rx';

import { CartTabComponent } from './cart-tab.component';

export function main() {
  describe('Cart Tab Component', () => {
    let componentUnderTest: CartTabComponent;
    let mockCartService: any;
    let mockUiConfig: any;
    let mockDialog: any;

    beforeEach(() => {
      mockCartService = {
        data: Observable.of({ someData: 'SOME_VALUE' }),
        addProject: jasmine.createSpy('addProject'),
        removeProject: jasmine.createSpy('removeProject'),
        updateProject: jasmine.createSpy('updateProject'),
        moveLineItemTo: jasmine.createSpy('moveLineItemTo'),
        cloneLineItem: jasmine.createSpy('cloneLineItem'),
        removeLineItem: jasmine.createSpy('removeLineItem'),
        editLineItem: jasmine.createSpy('editLineItem')
      };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: 'SOME_CONFIG' }))
      };

      mockDialog = {
        open: jasmine.createSpy('open').and.returnValue({
          componentInstance: {},
          afterClosed: function () {
            return Observable.of({ data: 'hi' });
          }
        })
      };

      componentUnderTest = new CartTabComponent(mockCartService, mockUiConfig, mockDialog);
    });

    describe('Initialization', () => {
      it('connects to the CartService data', () => {
        componentUnderTest.ngOnInit();

        componentUnderTest.cart.subscribe((cartData) => {
          expect(cartData.someData).toBe('SOME_VALUE');
        });
      });

      it('gets the UI config specifically for the cart', () => {
        componentUnderTest.ngOnInit();

        expect(mockUiConfig.get).toHaveBeenCalledWith('cart');
      });

      it('caches the cart UI config', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.config).toEqual('SOME_CONFIG');
      });
    });

    describe('Destruction', () => {
      it('unsubscribes from the UI config to prevent memory leakage', () => {
        let mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
        let mockObservable = { subscribe: () => mockSubscription };
        mockUiConfig = { get: () => mockObservable };

        componentUnderTest = new CartTabComponent(mockCartService, mockUiConfig, mockDialog);
        componentUnderTest.ngOnInit();
        componentUnderTest.ngOnDestroy();

        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('assetsInCart()', () => {
      it('returns an observable of false when the cart has no items', () => {
        mockCartService.data = Observable.of({ itemCount: 0 });

        componentUnderTest = new CartTabComponent(mockCartService, mockUiConfig, mockDialog);
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(false));
      });

      it('returns an observable of false when the cart has no itemCount member', () => {
        mockCartService.data = Observable.of({});

        componentUnderTest = new CartTabComponent(mockCartService, mockUiConfig, mockDialog);
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(false));
      });

      it('returns an observable of true when the cart has at least one line item', () => {
        mockCartService.data = Observable.of({ itemCount: 1 });

        componentUnderTest = new CartTabComponent(mockCartService, mockUiConfig, mockDialog);
        componentUnderTest.ngOnInit();

        componentUnderTest.assetsInCart.subscribe(answer => expect(answer).toBe(true));
      });
    });

    describe('onNotification()', () => {
      it('adds a project when notified with ADD_PROJECT', () => {
        componentUnderTest.onNotification({ type: 'ADD_PROJECT' });

        expect(mockCartService.addProject).toHaveBeenCalled();
      });

      it('removes a project when notified with REMOVE_PROJECT', () => {
        let mockProject = {};
        componentUnderTest.onNotification({ type: 'REMOVE_PROJECT', payload: mockProject });

        expect(mockCartService.removeProject).toHaveBeenCalledWith(mockProject);
      });

      it('updates a project when notified with UPDATE_PROJECT', () => {
        let mockProject = {};
        componentUnderTest.onNotification({ type: 'UPDATE_PROJECT', payload: mockProject });

        expect(mockDialog.open).toHaveBeenCalled();
      });

      it('moves a line item when notified with MOVE_LINE_ITEM', () => {
        let mockProject = {};
        let mockLineItem = {};
        componentUnderTest.onNotification({ type: 'MOVE_LINE_ITEM', payload: { lineItem: mockLineItem, otherProject: mockProject } });

        expect(mockCartService.moveLineItemTo).toHaveBeenCalledWith(mockProject, mockLineItem);
      });

      it('clones a line item when notified with CLONE_LINE_ITEM', () => {
        let mockLineItem = {};
        componentUnderTest.onNotification({ type: 'CLONE_LINE_ITEM', payload: mockLineItem });

        expect(mockCartService.cloneLineItem).toHaveBeenCalledWith(mockLineItem);
      });

      it('clones a line item when notified with REMOVE_LINE_ITEM', () => {
        let mockLineItem = {};
        componentUnderTest.onNotification({ type: 'REMOVE_LINE_ITEM', payload: mockLineItem });

        expect(mockCartService.removeLineItem).toHaveBeenCalledWith(mockLineItem);
      });

      it('edits a line item when notified with EDIT_LINE_ITEM', () => {
        let mockLineItem = {};
        componentUnderTest.onNotification(
          {
            type: 'EDIT_LINE_ITEM',
            payload: {
              lineItem: mockLineItem, fieldToEdit: { selectedTranscodeTarget: '1080i' }
            }
          });

        expect(mockCartService.editLineItem).toHaveBeenCalledWith(mockLineItem, { selectedTranscodeTarget: '1080i' });
      });
    });
  });
};
