import { ActiveCollectionService } from './active-collection.service';
import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Active Collection Service', () => {
    let serviceUnderTest: ActiveCollectionService;
    let mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new ActiveCollectionService(mockApiService.injector);
    });

    describe('load()', () => {
      it('calls the API correctly', () => {
        serviceUnderTest.load({ currentPage: 1, pageSize: 42 });

        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('collectionSummary/focused');
        expect(mockApiService.get).toHaveBeenCalledWithLoading(true);
      });

      it('also calls the API correctly to get assets for the loaded collection', () => {
        mockApiService.getResponse = { id: 10836 };

        serviceUnderTest.load({ currentPage: 1, pageSize: 42 }).take(1).subscribe();

        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('collectionSummary/assets/10836');
        expect(mockApiService.get).toHaveBeenCalledWithLoading(true);
        expect(mockApiService.get).toHaveBeenCalledWithParameters({ i: '0', n: '42' });
      });

      it('returns the expected observable', () => {
        mockApiService.getResponse = [
          { id: 10836 },
          {
            items: [
              { id: 123, other: 'stuff', timeStart: '123', timeEnd: '456' },
              { id: 456, other: 'stuff', timeStart: '-1', timeEnd: '-2' }
            ],
            totalCount: 2,
            currentPage: 0,
            pageSize: 42,
            hasNextPage: false,
            hasPreviousPage: false,
            numberOfPages: 1
          }
        ];

        serviceUnderTest.load({ currentPage: 1, pageSize: 42 }).take(1).subscribe(response => {
          expect(response).toEqual({
            id: 10836,
            assets: {
              items: [
                { id: 123, other: 'stuff', timeStart: 123, timeEnd: 456 },
                { id: 456, other: 'stuff', timeStart: -1, timeEnd: -2 }
              ],
              pagination: {
                totalCount: 2,
                currentPage: 1,
                pageSize: 42,
                hasNextPage: false,
                hasPreviousPage: false,
                numberOfPages: 1
              }
            }
          });
        });
      });
    });
  });
}
