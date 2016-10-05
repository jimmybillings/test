import { Observable } from 'rxjs/Rx';

import { CartComponent } from './cart.component';

export function main() {
  describe('Cart Component', () => {
    let componentUnderTest: CartComponent;
    let mockCartService: any;
    let mockUiConfig: any;

    beforeEach(() => {
      mockCartService = {
        data: Observable.of({ someData: 'SOME_VALUE' }),
        addProject: jasmine.createSpy('addProject'),
        removeProject: jasmine.createSpy('removeProject'),
        updateProject: jasmine.createSpy('updateProject'),
        moveLineItemTo: jasmine.createSpy('moveLineItemTo'),
        cloneLineItem: jasmine.createSpy('cloneLineItem'),
        removeLineItem: jasmine.createSpy('removeLineItem')
      };

      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: 'SOME_CONFIG' }))
      };

      componentUnderTest = new CartComponent(mockCartService, mockUiConfig);
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

        expect(mockCartService.updateProject).toHaveBeenCalledWith(mockProject);
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
    });
  });
};
