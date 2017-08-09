import { Observable } from 'rxjs/Observable';

import { CollectionShowComponent } from './collection-show.component';
import { MockAppStore } from '../../store/spec-helpers/mock-app.store';
import { ActionFactory } from '../../store/actions/active-collection.actions';

export function main() {
  describe('Collection Show Component', () => {
    let componentUnderTest: CollectionShowComponent, mockWindow: any, mockStore: MockAppStore,
      mockCapabilitiesService: any, mockChangeDetectorRef: any, mockRoute: any, mockUiConfig: any;


    beforeEach(() => {
      mockWindow = { nativeWindow: { location: { href: {} }, innerWidth: 200 } };
      mockCapabilitiesService = { editCollection: jasmine.createSpy('editCollection').and.returnValue(Observable.of(true)) };
      mockChangeDetectorRef = { markForCheck: jasmine.createSpy('markForCheck') };
      mockRoute = { params: Observable.of({ some: 'params' }) };
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: [{ some: 'item' }] } } }))
      };
      mockStore = new MockAppStore();
      mockStore.createStateElement('activeCollection', 'collection', { some: 'collection' });

      componentUnderTest = new CollectionShowComponent(
        mockCapabilitiesService, null, null, null, null, null, null, null, mockUiConfig,
        null, null, mockRoute, null, null, mockWindow, null, null, null, mockStore, mockChangeDetectorRef
      );
    });

    describe('get showCommentToggleButton()', () => {
      it('should call editCollection() on the cababilities service', () => {
        componentUnderTest.ngOnInit();
        let result: Observable<boolean> = componentUnderTest.showCommentToggleButton;

        expect(mockCapabilitiesService.editCollection).toHaveBeenCalledWith({ some: 'collection' });
      });
    });

    describe('get showCommentActions()', () => {
      it('should call editCollection() on the cababilities service', () => {
        componentUnderTest.ngOnInit();
        let result: Observable<boolean> = componentUnderTest.showCommentToggleButton;

        expect(mockCapabilitiesService.editCollection).toHaveBeenCalledWith({ some: 'collection' });
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

    describe('onCommentSubmit()', () => {
      it('dispatches the proper action with the comment', () => {
        const spy = mockStore.createActionFactoryMethod('activeCollection', 'addComment');
        componentUnderTest.onCommentSubmit({ comment: 'wowowowo' } as any);

        mockStore.expectDispatchFor(spy, { comment: 'wowowowo' });
      });
    });
  });
}
