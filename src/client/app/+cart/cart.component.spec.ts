import { inject, TestBed, beforeEachProvidersArray } from '../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { CartComponent } from './cart.component';
import { CartService } from '../shared/services/cart.service';

export function main() {
  describe('Cart Component', () => {
    const mockCartService = {
      data: Observable.of({ someData: 'SOME_VALUE' }),
      loadCart: jasmine.createSpy('loadCart() spy')
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CartComponent,
          { provide: CartService, useValue: mockCartService }
        ]
      });
    });

    describe('Initialization', () => {
      let componentUnderTest: CartComponent;

      beforeEach(inject([CartComponent], (cartComponent: CartComponent) => {
        componentUnderTest = cartComponent;
        componentUnderTest.ngOnInit();
      }));

      it('connects to the CartService data', () => {
        componentUnderTest.cart.subscribe((cartData) => {
          expect(cartData.someData).toBe('SOME_VALUE');
        });
      });

      it('tells CartService to load data', () => {
        expect(mockCartService.loadCart).toHaveBeenCalled();
      });
    });
  });
};
