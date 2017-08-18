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
      mockStore.createStateElement('activeCollection', 'collection', { id: 123 });
      mockStore.createStateElement('comment', 'count', { 'abc-123': 5 });
      getCountsSpy = mockStore.createActionFactoryMethod('comment', 'getCounts');

      componentUnderTest = new CollectionShowComponent(
        mockCapabilitiesService, null, null, null, null, null, null, null, mockUiConfig,
        null, null, mockRoute, null, null, mockWindow, null, null, null, mockStore, mockChangeDetectorRef
      );
    });

    describe('ngOnInit()', () => {
      it('calls getCounts on the comment action factory', () => {
        componentUnderTest.ngOnInit();
        expect(getCountsSpy).toHaveBeenCalled();
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
  });
}
