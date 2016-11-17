import { OrdersComponent } from './orders.component';
import { Observable } from 'rxjs/Rx';

export function main() {
  describe('Orders Component', () => {
    let componentUnderTest: OrdersComponent;
    let mockRouter: any, mockRoute: any;

    beforeEach(() => {
      mockRoute = { params: Observable.of({ i: '1', n: '4' }) };
      mockRouter = { navigate: jasmine.createSpy('navigate') };
      componentUnderTest = new OrdersComponent(null, mockRoute, mockRouter);
    });

    describe('Initialization', () => {
      it('Should subscribe to the activated route setting page and number per page from params', () => {
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.ordersPerPage).toEqual('4');
      });

      it('Should subscribe to the activated route without params per page default is 20', () => {
        mockRoute = { params: Observable.of({}) };
        componentUnderTest = new OrdersComponent(null, mockRoute, mockRouter);
        componentUnderTest.ngOnInit();
        expect(componentUnderTest.ordersPerPage).toEqual('20');
      });
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
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/commerce/orders', { i: '99', n: '20' }]);
      });
    });

    describe('search()', () => {
      it('Should accept a search query and navigate to a url that include the search query', () => {
        componentUnderTest.search({q: 'dogs'});
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/commerce/orders', { n: '20', q: 'dogs', i: 1 }]);
      });
    });
  });
}
