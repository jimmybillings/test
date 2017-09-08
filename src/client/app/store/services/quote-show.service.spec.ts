import { Observable } from 'rxjs/Observable';

import { FutureQuoteShowService } from './quote-show.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { MockAppStore } from '../spec-helpers/mock-app.store';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Future Quote Show Service', () => {
    let serviceUnderTest: FutureQuoteShowService, mockApiService: MockApiService, mockStore: MockAppStore,
      mockUserService: any, mockUserCapabilities: any, mockSales: boolean;

    const mockUser: any = { firstName: 'Ross', lastName: 'Edfort', emailAddress: 'rossedfort@email.com' };

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      mockStore = new MockAppStore();
      mockUserService = { getById: jasmine.createSpy('getById').and.returnValue(Observable.of(mockUser)) };
      mockUserCapabilities = { administerQuotes: jasmine.createSpy('administerQuotes').and.returnValue(mockSales) };
      serviceUnderTest = new FutureQuoteShowService(mockApiService.injector, mockStore, mockUserService, mockUserCapabilities);
    });

    describe('load', () => {
      describe('for a sales user', () => {
        beforeEach(() => {
          mockApiService.getResponse = { ownerUserId: 2 };
          mockSales = true;
        });

        it('calls the api service correctly', () => {
          serviceUnderTest.load(1);

          expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.get).toHaveBeenCalledWithEndpoint('quote/1');
          expect(mockApiService.get).toHaveBeenCalledWithLoading();
        });

        it('gets the owner of the quote', () => {
          serviceUnderTest.load(1).subscribe();

          expect(mockUserService.getById).toHaveBeenCalledWith(2);
        });

        it('returns the  right data', () => {
          let expectedQuote: any;
          serviceUnderTest.load(1).subscribe(q => expectedQuote = q);

          expect(expectedQuote).toEqual({
            ownerUserId: 2,
            createdUserEmailAddress: 'rossedfort@email.com',
            createdUserFullName: 'Ross Edfort'
          });
        });
      });

      describe('for a non-sales user', () => {
        beforeEach(() => {
          mockApiService.getResponse = { some: 'quote' };
          mockSales = false;
        });

        it('calls the api service correctly', () => {
          serviceUnderTest.load(1);

          expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Orders);
          expect(mockApiService.get).toHaveBeenCalledWithEndpoint('quote/1');
          expect(mockApiService.get).toHaveBeenCalledWithLoading();
        });

        it('returns an observable of the quote', () => {
          let expectedQuote: any;
          serviceUnderTest.load(1).subscribe(q => expectedQuote = q);

          expect(expectedQuote).toEqual({ some: 'quote' });
        });
      });
    });
  });
}
