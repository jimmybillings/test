import { Observable } from 'rxjs/Observable';

import { CartAssetComponent } from './cart-asset.component';

export function main() {
  describe('Cart Asset Component', () => {
    let componentUnderTest: CartAssetComponent;
    let mockUiConfig: any;

    beforeEach(() => {
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: [{ some: 'field' }] } } }))
      };

      componentUnderTest = new CartAssetComponent(mockUiConfig);
    });

    describe('ngOnInit()', () => {
      it('gets the right ui config', () => {
        componentUnderTest.ngOnInit();

        expect(mockUiConfig.get).toHaveBeenCalledWith('cartComment');
        expect(componentUnderTest.commentFormConfig).toEqual([{ some: 'field' }]);
      });
    });
  });
}
