import { CommentService } from './comment.service';
import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Comment Service', () => {
    let serviceUnderTest: CommentService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      mockApiService.getResponse = {
        items: [],
        currentPage: 0,
        numberOfPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
        pageSize: 10,
        totalCount: 100
      };
      serviceUnderTest = new CommentService(mockApiService.injector);
    });

    describe('getCommentsFor()', () => {
      it('calls the API correctly', () => {
        serviceUnderTest.getCommentsFor('collection', 123);

        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('comment/byType/collection/123');
      });

      describe('converts to response to the proper shape', () => {
        it('when items exist', () => {
          serviceUnderTest.getCommentsFor('collection', 123).subscribe(comments => expect(comments).toEqual({
            items: [],
            pagination: {
              currentPage: 0,
              numberOfPages: 10,
              hasNextPage: true,
              hasPreviousPage: false,
              pageSize: 10,
              totalCount: 100
            }
          }));
        });

        it('when items don\'t exist', () => {
          mockApiService.getResponse = {
            currentPage: 0,
            numberOfPages: 10,
            hasNextPage: true,
            hasPreviousPage: false,
            pageSize: 10,
            totalCount: 100
          };

          serviceUnderTest.getCommentsFor('collection', 123).subscribe(comments => expect(comments).toEqual({
            items: [],
            pagination: {
              currentPage: 0,
              numberOfPages: 10,
              hasNextPage: true,
              hasPreviousPage: false,
              pageSize: 10,
              totalCount: 100
            }
          }));
        });
      });
    });

    describe('addCommentTo()', () => {
      it('calls the API correctly', () => {
        serviceUnderTest.addCommentTo('collection', 123, { comment: 'wow' } as any);

        expect(mockApiService.post).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApiService.post).toHaveBeenCalledWithEndpoint('comment/byType/collection/123');
        expect(mockApiService.post).toHaveBeenCalledWithBody({ comment: 'wow' });
        expect(mockApiService.post).toHaveBeenCalledWithLoading(true);
      });
    });

    describe('editComment()', () => {
      it('calls the api service correctly', () => {
        serviceUnderTest.editComment({ some: 'comment', id: 123 } as any);

        expect(mockApiService.put).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApiService.put).toHaveBeenCalledWithEndpoint('comment/123');
        expect(mockApiService.put).toHaveBeenCalledWithBody({ some: 'comment', id: 123 });
        expect(mockApiService.put).toHaveBeenCalledWithLoading(true);
      });
    });
  });
}
