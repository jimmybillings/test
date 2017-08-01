import { Observable } from 'rxjs/Observable';

import { CollectionShowComponent } from './collection-show.component';
import { StoreSpecHelper } from '../../store/store.spec-helper';
import { ActionFactory } from '../../store/actions/active-collection.actions';

export function main() {
  describe('Collection Show Component', () => {
    let componentUnderTest: CollectionShowComponent, mockWindow: any, storeSpecHelper: StoreSpecHelper,
      mockCapabilitiesService: any, mockChangeDetectorRef: any, mockRoute: any, mockUiConfig: any;

    storeSpecHelper = new StoreSpecHelper();
    storeSpecHelper.createMockStateElement('activeCollection', 'collection', { some: 'collection' });

    beforeEach(() => {
      mockWindow = { nativeWindow: { location: { href: {} }, innerWidth: 200 } };
      mockCapabilitiesService = { editCollection: jasmine.createSpy('editCollection').and.returnValue(Observable.of(true)) };
      mockChangeDetectorRef = { markForCheck: jasmine.createSpy('markForCheck') };
      mockRoute = { params: Observable.of({ some: 'params' }) };
      mockUiConfig = {
        get: jasmine.createSpy('get').and.returnValue(Observable.of({ config: { form: { items: [{ some: 'item' }] } } }))
      };
      componentUnderTest = new CollectionShowComponent(
        mockCapabilitiesService, null, null, null, null, null, null, null, mockUiConfig,
        null, null, mockRoute, null, null, null, mockWindow, null, null, null, storeSpecHelper.mockStore, mockChangeDetectorRef
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
        const spy = storeSpecHelper.createMockActionFactoryMethod(factory => factory.activeCollection, 'addComment');
        componentUnderTest.onCommentSubmit({ comment: 'wowowowo' } as any);

        storeSpecHelper.expectDispatchFor(spy, { comment: 'wowowowo' });
      });
    });
  });
}
