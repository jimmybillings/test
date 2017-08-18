import { WzCommentComponent } from './wz.comment.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Wz Comment Component', () => {
    let componentUnderTest: WzCommentComponent, mockStore: MockAppStore,
      loadSpy: jasmine.Spy, formSubmitSpy: jasmine.Spy, removeSpy: jasmine.Spy, changeToEditSpy: jasmine.Spy,
      changeFormModeToAdd: jasmine.Spy;

    const mockWzForm: any = {
      resetForm: jasmine.createSpy('resetForm'),
      mergeNewValues: jasmine.createSpy('mergeNewValues')
    };

    beforeEach(() => {
      mockStore = new MockAppStore();
      mockStore.createStateSection('comment', {
        formSubmitLabel: 'some.trKey',
        collection: { items: [{ some: 'comment' }], pagination: {} }
      });

      loadSpy = mockStore.createActionFactoryMethod('comment', 'load');
      formSubmitSpy = mockStore.createActionFactoryMethod('comment', 'formSubmit');
      removeSpy = mockStore.createActionFactoryMethod('dialog', 'showConfirmation');
      changeToEditSpy = mockStore.createActionFactoryMethod('comment', 'changeFormModeToEdit');
      changeFormModeToAdd = mockStore.createActionFactoryMethod('comment', 'changeFormModeToAdd');

      componentUnderTest = new WzCommentComponent(mockStore);
      componentUnderTest.wzForm = mockWzForm;
      componentUnderTest.formFields = [{ name: 'some', value: '' }] as any;
    });

    describe('parentObject setter', () => {
      beforeEach(() => {
        componentUnderTest.parentObject = { objectType: 'collection', objectId: '1' };
      });

      it('should dispatch the getComments action', () => {
        mockStore.expectDispatchFor(loadSpy, { objectType: 'collection', objectId: '1' });
      });

      it('should set the comments instance variable', () => {
        componentUnderTest.comments.take(1).subscribe(comments =>
          expect(comments).toEqual({ items: [{ some: 'comment' }], pagination: {} })
        );
      });
    });

    describe('onFormSubmit', () => {
      beforeEach(() => {
        componentUnderTest.parentObject = { objectType: 'collection', objectId: '1' };
      });

      it('dispatches the proper action to the store', () => {
        componentUnderTest.onFormSubmit({ some: 'comment' } as any);

        mockStore.expectDispatchFor(formSubmitSpy, { objectType: 'collection', objectId: '1' }, { some: 'comment' });
      });

      it('resets the form', () => {
        componentUnderTest.onFormSubmit({ some: 'comment' } as any);

        expect(componentUnderTest.wzForm.resetForm).toHaveBeenCalled();
      });
    });

    describe('get commentsExist()', () => {
      it('returns true if there are comments', () => {
        componentUnderTest.parentObject = { objectType: 'collection', objectId: '1' };

        componentUnderTest.commentsExist.take(1).subscribe(result => expect(result).toBe(true));
      });

      it('returns false if there are no comments', () => {
        mockStore.createStateSection('comment', { collection: { items: [], pagination: {} } });
        componentUnderTest.parentObject = { objectType: 'collection', objectId: '1' };

        componentUnderTest.commentsExist.take(1).subscribe(result => expect(result).toBe(false));
      });
    });

    describe('onEditButtonClick()', () => {
      beforeEach(() => {
        componentUnderTest.onEditCommentButtonClick({ some: 'comment' } as any);
      });

      it('calls mergeNewValues() on the form', () => {
        expect(mockWzForm.mergeNewValues).toHaveBeenCalledWith([{ name: 'some', value: 'comment' }]);
      });

      it('dispatches the proper action', () => {
        mockStore.expectDispatchFor(changeToEditSpy, { some: 'comment' });
      });
    });

    describe('initials()', () => {
      it('returns the proper string given a full userName', () => {
        expect(componentUnderTest.initials('Ross Edfort')).toBe('RE');
      });

      it('upcases the names', () => {
        expect(componentUnderTest.initials('ross edfort')).toBe('RE');
      });
    });

    describe('get formSubmitLabel', () => {
      it('returns the value thats in the store', () => {
        componentUnderTest.formSubmitLabel
          .subscribe(label => expect(label).toBe('some.trKey'));
      });
    });

    describe('onFormCancel()', () => {
      beforeEach(() => {
        componentUnderTest.onFormCancel();
      });

      it('calls resetForm() on the wzForm', () => {
        expect(mockWzForm.resetForm).toHaveBeenCalled();
      });

      it('dispatches the correct action', () => {
        mockStore.expectDispatchFor(changeFormModeToAdd);
      });
    });

    describe('onDeleteCommentButtonClick()', () => {
      it('dispatches the right action', () => {
        componentUnderTest.parentObject = { objectType: 'collection', objectId: '1' };
        componentUnderTest.onDeleteCommentButtonClick({ some: 'comment', id: 2 } as any);

        mockStore.expectDispatchFor(removeSpy, jasmine.any(Object), jasmine.any(Function));
      });
    });

    describe('showEditCommentButton', () => {
      describe('returns true', () => {
        it('when the userId is the same as the comment ownerId', () => {
          componentUnderTest.currentUserId = 1;
          expect(componentUnderTest.showEditCommentButton(1)).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the userId is NOT the same as the comment ownerId', () => {
          componentUnderTest.currentUserId = 1;
          expect(componentUnderTest.showEditCommentButton(2)).toBe(false);
        });
      });
    });

    describe('showDeleteCommentButton', () => {
      describe('returns true', () => {
        it('when the userId is the same as the comment ownerId', () => {
          componentUnderTest.currentUserId = 1;
          expect(componentUnderTest.showDeleteCommentButton(1)).toBe(true);
        });
      });

      describe('returns false', () => {
        it('when the userId is NOT the same as the comment ownerId', () => {
          componentUnderTest.currentUserId = 1;
          expect(componentUnderTest.showDeleteCommentButton(2)).toBe(false);
        });
      });
    });
  });
}
