import { Observable } from 'rxjs/Rx';

import { ReviewTabComponent } from './review-tab.component';

export function main() {
  describe('Review Tab Component', () => {
    let componentUnderTest: ReviewTabComponent;
    let mockRouter: any, mockOrderStore: any, mockNotification: any, mockSnackbar: any, mockTranslate: any;

    beforeEach(() => {
      let mockCartService: any = {
        data: Observable.of({ someData: 'SOME_VALUE' }),
        purchaseOnCredit: () => Observable.of({ id: 10836 })
      };

      let mockCartCapabilities: any = {
        purchaseOnCredit: () => true
      };

      mockRouter = {
        navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve())
      };

      mockOrderStore = {
        update: jasmine.createSpy('update')
      };

      mockNotification = {
        create: jasmine.createSpy('create')
      };

      mockSnackbar = {
        open: jasmine.createSpy('open')
      };

      mockTranslate = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of('translation'))
      };

      componentUnderTest =
        new ReviewTabComponent(mockCartService, mockCartCapabilities, mockRouter, mockOrderStore, mockSnackbar, mockTranslate);
    });

    describe('Initialization', () => {
      it('connects to the CartService data', () => {
        componentUnderTest.ngOnInit();

        componentUnderTest.cart.subscribe((cartData) => {
          expect(cartData.someData).toBe('SOME_VALUE');
        });
      });

      it('loads the "purchaseOnCredit" capability', () => {
        componentUnderTest.ngOnInit();

        expect(componentUnderTest.canPurchaseOnCredit).toBe(true);
      });
    });

    describe('purchaseOnCredit()', () => {
      it('navigates to the page for the newly created order', () => {
        componentUnderTest.purchaseOnCredit();

        expect(mockRouter.navigate)
          .toHaveBeenCalledWith(['/commerce/order/10836']);
      });

      it('updates the order store', () => {
        componentUnderTest.purchaseOnCredit();

        expect(mockOrderStore.update)
          .toHaveBeenCalledWith({ id: 10836 });
      });
    });
  });
};
