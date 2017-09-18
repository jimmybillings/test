import { Observable } from 'rxjs/Observable';

import { CollectionShowComponent } from './collection-show.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';
import { ActionFactory } from '../../store/actions/active-collection.actions';

export function main() {
  describe('Collection Show Component', () => {
    let componentUnderTest: CollectionShowComponent, mockWindow: any, mockStore: MockAppStore,
      mockCapabilitiesService: any, mockChangeDetectorRef: any, mockRoute: any, mockUiConfig: any, getCountsSpy: jasmine.Spy;

    beforeEach(() => {
      mockWindow = { nativeWindow: { location: { href: {} }, innerWidth: 200 } };
      mockCapabilitiesService = { editCollection: jasmine.createSpy('editCollection').and.returnValue(Observable.of(true)) };
      mockChangeDetectorRef = { markForCheck: jasmine.createSpy('markForCheck') };
      mockRoute = { params: Observable.of({ some: 'params' }) };
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: [{ some: 'item' }] } } }))
      };
      mockStore = new MockAppStore();
      mockStore.createStateSection('activeCollection', { collection: { id: 123 }, loaded: true });
      mockStore.createStateSection('comment', { collection: { pagination: { totalCount: 3 } } });
      getCountsSpy = mockStore.createActionFactoryMethod('comment', 'getCounts');

      componentUnderTest = new CollectionShowComponent(
        mockCapabilitiesService, null, null, null, null, null, null, mockUiConfig,
        null, null, mockRoute, null, null, mockWindow, null, null, null, mockStore, mockChangeDetectorRef
      );
    });

    describe('ngOnInit()', () => {
      describe('with a valid active collection', () => {
        beforeEach(() => {
          componentUnderTest.ngOnInit();
        });

        it('calls getCounts on the comment action factory', () => {
          expect(getCountsSpy).toHaveBeenCalled();
        });

        it('sets up the commentParentObject instance variable', () => {
          expect(componentUnderTest.commentParentObject).toEqual({ objectType: 'collection', objectId: 123 });
        });
      });

      describe('with an invalid active collection (without an id)', () => {
        beforeEach(() => {
          mockStore.createStateElement('activeCollection', 'collection', { id: null });
          componentUnderTest.ngOnInit();
        });

        it('does not call getCounts on the comment action factory', () => {
          expect(getCountsSpy).not.toHaveBeenCalled();
        });

        it('does not set up the commentParentObject instance variabl', () => {
          expect(componentUnderTest.commentParentObject).toBeUndefined();
        });
      });
    });

    describe('get userCanEditCollection()', () => {
      it('should call editCollection() on the cababilities service', () => {
        componentUnderTest.ngOnInit();
        let result: Observable<boolean> = componentUnderTest.userCanEditCollection;

        result.take(1).subscribe(res => expect(res).toEqual(true));
      });
    });

    describe('toggleCommentsVisibility()', () => {
      it('should toggle the showComments flag', () => {
        componentUnderTest.showComments = false;
        componentUnderTest.toggleCommentsVisibility();
        expect(componentUnderTest.showComments).toBe(true);
        componentUnderTest.toggleCommentsVisibility();
        expect(componentUnderTest.showComments).toBe(false);
      });
    });

    describe('commentCounts getter', () => {
      it('selects the right part of the store', () => {
        let count: number;
        componentUnderTest.commentCount.subscribe(c => count = c);
        expect(count).toBe(3);
      });
    });
  });
}
