import { WzDeliveryOptionsComponent } from './wz.delivery-options.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Wz Delivery Options Component', () => {
    let componentUnderTest: WzDeliveryOptionsComponent;
    let mockStore: MockAppStore;

    beforeEach(() => {
      mockStore = new MockAppStore();
      mockStore.createStateSection('asset', { options: [{ some: 'options' }], hasDeliveryOptions: true, loading: false });
      componentUnderTest = new WzDeliveryOptionsComponent(mockStore);
    });

    describe('ngOnInit()', () => {
      beforeEach(() => {
        componentUnderTest.ngOnInit();
      });

      it('sets up the deliveryOptions Observable', () => {
        let options: any;
        componentUnderTest.deliveryOptions.take(1).subscribe(deliveryOptions => options = deliveryOptions);
        expect(options).toEqual([{ some: 'options' }]);
      });

      it('sets up the hasDeliveryOptions Observable', () => {
        let hasOptions: any;
        componentUnderTest.hasDeliveryOptions.take(1).subscribe(hasDeliveryOptions => hasOptions = hasDeliveryOptions);
        expect(hasOptions).toBe(true);
      });

      it('sets up the showLoadingSpinner Observable', () => {
        let showLoading: any;
        componentUnderTest.showLoadingSpinner.take(1).subscribe(showLoadingSpinner => showLoading = showLoadingSpinner);
        expect(showLoading).toBe(false);
      });
    });

    describe('iconStringFor()', () => {
      it('returns the translation string interpolated with the option transfer type', () => {
        expect(componentUnderTest.iconStringFor({ deliveryOptionTransferType: 'aspera' } as any))
          .toEqual('ASSET.DELIVERY_OPTIONS.ICON.aspera');
      });
    });

    describe('trStringFor()', () => {
      it('returns the translation string interpolated with the first option of the group\'s label', () => {
        expect(componentUnderTest.trStringFor([{ deliveryOptionLabel: 'someLabel' }] as any))
          .toEqual('ASSET.DELIVERY_OPTIONS.LABEL.someLabel');
      });
    });
  });
}
