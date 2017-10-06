import { Observable } from 'rxjs/Observable';
import { CollectionsResolver } from './collections.resolver';

export function main() {
  describe('Collections Resolver', () => {
    let resolverUnderTest: CollectionsResolver;
    let mockCollectionsService: any;
    let mockState: any;
    let resolved: jasmine.Spy;

    function instanstiator() {
      resolved = jasmine.createSpy('resolved');
      mockCollectionsService = {
        state: mockState,
        data: Observable.of(mockState),
        load: jasmine.createSpy('load').and.returnValue(Observable.of({ some: 'collections' }))
      };
      resolverUnderTest = new CollectionsResolver(mockCollectionsService);
    }

    describe('resolve()', () => {
      describe('when there are no items in the store', () => {
        beforeEach(() => {
          mockState = { items: [] };
          instanstiator();
        });

        it('should call load() on the collections service', () => {
          resolverUnderTest.resolve().take(1).subscribe();

          expect(mockCollectionsService.load).toHaveBeenCalled();
        });

        it('should not resolve', () => {
          resolverUnderTest.resolve().take(1).subscribe(resolved);

          expect(resolved).not.toHaveBeenCalled();
        });
      });

      describe('when there are items in the store', () => {
        beforeEach(() => {
          mockState = { items: [{ some: 'collection' }] };
          instanstiator();
        });

        it('should call load() on the collections service', () => {
          resolverUnderTest.resolve().take(1).subscribe();

          expect(mockCollectionsService.load).not.toHaveBeenCalled();
        });

        it('should resolve', () => {
          resolverUnderTest.resolve().take(1).subscribe(resolved);

          expect(resolved).toHaveBeenCalled();
        });
      });
    });
  });
}
