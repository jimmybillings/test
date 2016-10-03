import { inject, TestBed, beforeEachProvidersArray } from '../imports/test.imports';
import { Observable } from 'rxjs/Rx';

import { CartComponent } from './cart.component';
import { CartService } from './services/cart.service';

export function main() {
  describe('Cart Component', () => {
    const mockCartService = {
      data: Observable.of({ someData: 'SOME_VALUE' }),
      addProject: jasmine.createSpy('addProject'),
      removeProject: jasmine.createSpy('removeProject')
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
    });

    describe('onNotification()', () => {
      let componentUnderTest: CartComponent;

      beforeEach(inject([CartComponent], (cartComponent: CartComponent) => {
        componentUnderTest = cartComponent;
      }));

      it('adds a project when notified with ADD_PROJECT', () => {
        componentUnderTest.onNotification({ type: 'ADD_PROJECT' });

        expect(mockCartService.addProject).toHaveBeenCalled();
      });

      it('removes a project when notified with REMOVE_PROJECT', () => {
        let mockProject = {};
        componentUnderTest.onNotification({ type: 'REMOVE_PROJECT', payload: mockProject });

        expect(mockCartService.removeProject).toHaveBeenCalledWith(mockProject);
      });
    });
  });
};
