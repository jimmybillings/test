import { Observable } from 'rxjs/Rx';

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

    describe('component', () => {
      it('has a translationReady function for formatting metadata', () => {
        let trReady: string = componentUnderTest.translationReady('Format.QuickTime.Codec');

        expect(trReady).toBe('assetmetadata.Format_QuickTime_Codec');
      });

      it('has a downloadMaster function that changes the windows location', () => {
        componentUnderTest.downloadMaster('https://this-is-a-url.com');

        expect(mockWindow.nativeWindow.location.href).toBe('https://this-is-a-url.com');
      });
    });
  });
};
