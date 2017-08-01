import { Observable } from 'rxjs/Observable';

import { ActiveCollectionService } from './active-collection.service';
import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Active Collection Service', () => {
    let serviceUnderTest: ActiveCollectionService, mockApiService: MockApiService, mockCommentService: any;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      mockCommentService = {
        addCommentTo: jasmine.createSpy('addCommentTo').and.returnValue(Observable.of({ some: 'comment' })),
        getCommentsFor: jasmine.createSpy('getCommentsFor').and.returnValue(Observable.of([{ some: 'comments' }])),
      };
      serviceUnderTest = new ActiveCollectionService(mockApiService.injector, mockCommentService);
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
            },
            comments: [
              { some: 'comments' }
            ]
          });
        });
      });
    });

    describe('addCommentTo()', () => {
      beforeEach(() => {
        serviceUnderTest.addCommentTo({ id: 123 } as any, { comment: 'yay' } as any).subscribe();
      });

      it('calls the comment service correctly', () => {
        expect(mockCommentService.addCommentTo).toHaveBeenCalledWith('collection', 123, { comment: 'yay' });
      });

      it('gets the comments in the flatMap', () => {
        expect(mockCommentService.getCommentsFor).toHaveBeenCalledWith('collection', 123);
      });
    });
  });
}
