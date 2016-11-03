import { Observable } from 'rxjs/Rx';

import { OrderShowComponent } from './order-show.component';

export function main() {
  describe('Order Show Component', () => {
    let componentUnderTest: OrderShowComponent;
    let mockOrderService: any;

    beforeEach(() => {
      mockOrderService = {
        data: Observable.of({ someData: 'SOME_VALUE' })
      };

      componentUnderTest = new OrderShowComponent(mockOrderService);

      it('has a translationReady function for formatting metadata', () => {
        let trReady: string = componentUnderTest.translationReady('Format.QuickTime.Codec');

        expect(trReady).toBe('assetmetadata.Format_QuickTime_Codec');
      });

      it('has a downloadMaster function that changes the windows location', () => {
        componentUnderTest.downloadMaster('https://thisisaurl.com');

        expect(window.location.href).toBe('https://thisisaurl.com');
      });
    });
  });
};
