import { Observable } from 'rxjs/Observable';

import { OrderShowComponent } from './order-show.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Order Show Component', () => {
    let componentUnderTest: OrderShowComponent;
    let mockAppStore: MockAppStore;
    let mockOrderService: any, mockWindow: any;

    beforeEach(() => {
      mockWindow = {
        nativeWindow: {
          location: { href: '' }
        }
      };

      mockAppStore = new MockAppStore();
      componentUnderTest = new OrderShowComponent(mockWindow, mockAppStore);
    });

    describe('orderObservable property', () => {
      it('represents the store\'s active order', () => {
        mockAppStore.createStateElement('order', 'activeOrder', { some: 'order', projects: [] });
        componentUnderTest = new OrderShowComponent(mockWindow, mockAppStore);

        expect(componentUnderTest.orderObservable).toEqual(Observable.of({ some: 'order', projects: [] }));
      });

      it('creates an empty lineItems array for projects that don\'t have lineItems', () => {
        mockAppStore.createStateElement(
          'order',
          'activeOrder',
          {
            some: 'order',
            id: 42,
            projects: [{ lineItems: [{ asset: {} }] }, {}]
          }
        );

        let retrievedOrder: any;

        new OrderShowComponent(mockWindow, mockAppStore).orderObservable.take(1).subscribe(order => retrievedOrder = order);

        expect(retrievedOrder.projects[1].lineItems).toEqual([]);
      });

      it('contains enhanced assets', () => {
        mockAppStore.createStateElement(
          'order',
          'activeOrder',
          {
            some: 'order',
            id: 42,
            projects: [{ lineItems: [{ asset: {} }] }]
          }
        );

        new OrderShowComponent(mockWindow, mockAppStore).orderObservable.subscribe(order => {
          const asset: any = order.projects[0].lineItems[0].asset;

          expect(asset.type).toEqual('orderAsset');
          expect(asset.parentId).toEqual(42);
        });
      });
    });

    describe('downloadMaster()', () => {
      it('changes the window\'s location', () => {
        componentUnderTest.downloadMaster('https://this-is-a-url.com');
        expect(mockWindow.nativeWindow.location.href).toBe('https://this-is-a-url.com');
      });
    });

    describe('assetCountLabelKeyFor()', () => {
      it('returns pluralized translatable string based on asset count. If count is 0 return no assets', () => {
        expect(componentUnderTest.assetCountLabelKeyFor(0)).toBe('ORDER.SHOW.PROJECTS.NO_ASSETS');
      });

      it('returns 1 asset if asset count is 1', () => {
        expect(componentUnderTest.assetCountLabelKeyFor(1)).toBe('ORDER.SHOW.PROJECTS.ONLY_ONE_ASSET');
      });

      it('returns x assets if asset count is more than 1', () => {
        expect(componentUnderTest.assetCountLabelKeyFor(20)).toBe('ORDER.SHOW.PROJECTS.MORE_THAN_ONE_ASSET');
      });
    });

    describe('isRefundedLineItem()', () => {
      it('returns false if the price is > 0', () => {
        expect(componentUnderTest.isRefundedLineItem({ price: 100 })).toBe(false);
      });

      it('returns true if the price is < 0', () => {
        expect(componentUnderTest.isRefundedLineItem({ price: -100 })).toBe(true);
      });
    });

    describe('isRefundedProject()', () => {
      it('returns false if there is no creditMemoForProjectId', () => {
        expect(componentUnderTest.isRefundedProject({} as any)).toBe(false);
      });

      it('returns true if there is a creditMemoForProjectId', () => {
        expect(componentUnderTest.isRefundedProject({ creditMemoForProjectId: 12345 } as any)).toBe(true);
      });
    });

    describe('isRefundedOrder()', () => {
      it('returns true if the order has a corresponding credit memo', () => {
        expect(componentUnderTest.isRefundedOrder({ creditMemoForOrderId: 12345 } as any)).toBe(true);
      });

      it('returns false if the order doesn\'t have a corresponding credit memo', () => {
        expect(componentUnderTest.isRefundedOrder({} as any)).toBe(false);
      });
    });

    describe('shouldShowDiscountFor()', () => {
      it('returns true if the order has a discount value greater than zero', () => {
        expect(componentUnderTest.shouldShowDiscountFor({ discount: 16 } as any)).toBe(true);
      });

      it('returns false if the order has a discount value of zero', () => {
        expect(componentUnderTest.shouldShowDiscountFor({ discount: 0 } as any)).toBe(false);
      });

      it('returns false if the order has a discount value greater than zero, but is a refund', () => {
        expect(componentUnderTest.shouldShowDiscountFor({ discount: 16, creditMemoForOrderId: 12345 } as any)).toBe(false);
      });

      it('returns false if the order has a no discount value', () => {
        expect(componentUnderTest.shouldShowDiscountFor({} as any)).toBe(false);
      });
    });
  });
};
