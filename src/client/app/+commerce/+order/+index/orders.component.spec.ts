import { OrdersComponent } from './orders.component';

export function main() {
  describe('Orders Component', () => {
    let componentUnderTest: OrdersComponent;
    let mockRouter: any;
    beforeEach(() => {
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      componentUnderTest = new OrdersComponent(null, mockRouter);
    });

    describe('toggleShowOrderSearch()', () => {
      it('Should be set to false when class is instantiated', () => {
        expect(componentUnderTest.itemSearchIsShowing).toEqual(false);
      });

      it('Should change to true when the method is first called', () => {
        componentUnderTest.toggleShowOrderSearch();
        expect(componentUnderTest.itemSearchIsShowing).toEqual(true);
      });
    });

    describe('changePage()', () => {
      it('Should accept a page number and navigate to the correct page url', () => {
        componentUnderTest.changePage('99');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders', { i: '99', n: '20' }]);
      });
    });

  });
};

