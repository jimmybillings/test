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

    describe('component', () => {
      it('has a downloadMaster function that changes the windows location', () => {
        componentUnderTest.downloadMaster('https://this-is-a-url.com');
        expect(mockWindow.nativeWindow.location.href).toBe('https://this-is-a-url.com');
      });
      it('should return pluralized translatable string based on asset count. If count is 0 return no assets', () => {
        expect(componentUnderTest.displayOrderAssetCount(0)).toBe('ORDER.PROJECTS.NO_ASSETS');
      });
      it('should return 1 asset if asset count is 1', () => {
        expect(componentUnderTest.displayOrderAssetCount(1)).toBe('ORDER.PROJECTS.ONLY_ONE_ASSET');
      });
      it('should return x assets if asset count is more than 1', () => {
        expect(componentUnderTest.displayOrderAssetCount(20)).toBe('ORDER.PROJECTS.MORE_THAN_ONE_ASSET');
      });
    });
  });
};
