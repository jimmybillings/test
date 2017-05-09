import { Observable } from 'rxjs/Observable';

import { OrderShowComponent } from './order-show.component';

export function main() {
  describe('Order Show', () => {
    let componentUnderTest: OrderShowComponent;
    let mockOrderService: any, mockWindow: any;

    beforeEach(() => {
      mockOrderService = {
        data: Observable.of({ someData: 'SOME_VALUE' })
      };
      mockWindow = {
        nativeWindow: {
          location: { href: '' }
        }
      };
      componentUnderTest = new OrderShowComponent(mockWindow, mockOrderService);
    });

    describe('downloadMaster()', () => {
      it('changes the windows location', () => {
        componentUnderTest.downloadMaster('https://this-is-a-url.com');
        expect(mockWindow.nativeWindow.location.href).toBe('https://this-is-a-url.com');
      });
    });


    describe('displayOrderAssetCount()', () => {
      it('should return pluralized translatable string based on asset count. If count is 0 return no assets', () => {
        expect(componentUnderTest.displayOrderAssetCount(0)).toBe('ORDER.SHOW.PROJECTS.NO_ASSETS');
      });

      it('should return 1 asset if asset count is 1', () => {
        expect(componentUnderTest.displayOrderAssetCount(1)).toBe('ORDER.SHOW.PROJECTS.ONLY_ONE_ASSET');
      });

      it('should return x assets if asset count is more than 1', () => {
        expect(componentUnderTest.displayOrderAssetCount(20)).toBe('ORDER.SHOW.PROJECTS.MORE_THAN_ONE_ASSET');
      });
    });

    describe('isRefundedLineItem()', () => {
      it('return false if the price is > 0', () => {
        expect(componentUnderTest.isRefundedLineItem({ price: 100 })).toBe(false);
      });

      it('return true if the price is < 0', () => {
        expect(componentUnderTest.isRefundedLineItem({ price: -100 })).toBe(true);
      });
    });

    describe('isRefundedProject()', () => {
      it('return false if there is no creditMemoForProjectId', () => {
        expect(componentUnderTest.isRefundedProject({} as any)).toBe(false);
      });

      it('return true if there is a creditMemoForProjectId', () => {
        expect(componentUnderTest.isRefundedProject({ creditMemoForProjectId: 12345 } as any)).toBe(true);
      });
    });

    describe('get isRefund()', () => {
      let mockOrder: any;
      it('return an observable of true if the order is a refund', () => {
        mockOrder = { creditMemoForOrderId: 12345 };
        mockOrderService = { data: Observable.of(mockOrder) };
        new OrderShowComponent(null, mockOrderService).isRefund.subscribe(is => expect(is).toBe(true));
      });

      it('return an observable of false if the order is not a refund', () => {
        mockOrder = { id: 1 };
        mockOrderService = { data: Observable.of(mockOrder) };
        new OrderShowComponent(null, mockOrderService).isRefund.subscribe(is => expect(is).toBe(false));
      });
    });

    describe('get creditMemoForOrderId()', () => {
      let mockOrder: any;
      it('should return the creditMemoForOrderId if the order has one', () => {
        mockOrder = { creditMemoForOrderId: 12345 };
        mockOrderService = { data: Observable.of(mockOrder) };
        new OrderShowComponent(null, mockOrderService).creditMemoForOrderId.subscribe(id => expect(id).toBe(12345));
      });

      it('should return the creditMemoForOrderId if the order has one', () => {
        mockOrder = { id: 1 };
        mockOrderService = { data: Observable.of(mockOrder) };
        new OrderShowComponent(null, mockOrderService).creditMemoForOrderId.subscribe(id => expect(id).toBe(undefined));
      });
    });
  });
};
