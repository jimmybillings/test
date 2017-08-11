import { WzCommentComponent } from './wz.comment.component';
import { MockAppStore } from '../../../store/spec-helpers/mock-app.store';

export function main() {
  describe('Wz Comment Component', () => {
    let componentUnderTest: WzCommentComponent, mockStore: MockAppStore,
      getCommentsSpy: jasmine.Spy, addCommentSpy: jasmine.Spy, editCommentSpy: jasmine.Spy, removeCommentSpy: jasmine.Spy;

    const mockWzForm: any = {
      resetForm: jasmine.createSpy('resetForm'),
      mergeNewValues: jasmine.createSpy('mergeNewValues')
    };

    beforeEach(() => {
      mockStore = new MockAppStore();
      mockStore.createStateSection('comment', { collection: { items: [{ some: 'comment' }], pagination: {} } });

      getCommentsSpy = mockStore.createActionFactoryMethod('comment', 'getComments');
      addCommentSpy = mockStore.createActionFactoryMethod('comment', 'addComment');
      editCommentSpy = mockStore.createActionFactoryMethod('comment', 'editComment');
      removeCommentSpy = mockStore.createActionFactoryMethod('comment', 'removeComment');

      componentUnderTest = new WzCommentComponent(mockStore);
      componentUnderTest.wzForm = mockWzForm;
      componentUnderTest.formFields = [{ name: 'some', value: '' }] as any;
    });

    describe('parentObject setter', () => {
      beforeEach(() => {
        componentUnderTest.parentObject = { objectType: 'collection', objectId: 1 };
      });

      it('should dispatch the getComments action', () => {
        mockStore.expectDispatchFor(getCommentsSpy, 'collection', 1);
      });

      it('should set the comments instance variable', () => {
        componentUnderTest.comments.take(1).subscribe(comments =>
          expect(comments).toEqual({ items: [{ some: 'comment' }], pagination: {} })
        );
      });
    });

    describe('onFormSubmit', () => {
      beforeEach(() => {
        componentUnderTest.parentObject = { objectType: 'collection', objectId: 1 };
      });

      describe('for adding a comment', () => {
        it('dispatches the proper action to the store', () => {
          componentUnderTest.onFormSubmit({ some: 'comment' } as any);

          mockStore.expectDispatchFor(addCommentSpy, 'collection', 1, { some: 'comment' });
        });
      });

      describe('for editing a comment', () => {
        beforeEach(() => {
          componentUnderTest.onEditCommentButtonClick({ some: 'comment' } as any);
        });

        it('emits the \'editCommentSubmit\' event with the new comment', () => {
          componentUnderTest.onFormSubmit({ the: 'newComment' } as any);

          mockStore.expectDispatchFor(editCommentSpy, 'collection', 1, { some: 'comment', the: 'newComment' });
        });
      });

      it('resets the form', () => {
        componentUnderTest.onFormSubmit({ some: 'comment' } as any);

        expect(componentUnderTest.wzForm.resetForm).toHaveBeenCalled();
      });
    });

    describe('get commentsExist()', () => {
      it('returns true if there are comments', () => {
        componentUnderTest.parentObject = { objectType: 'collection', objectId: 1 };

        componentUnderTest.commentsExist.take(1).subscribe(result => expect(result).toBe(true));
      });

      it('returns false if there are no comments', () => {
        mockStore.createStateSection('comment', { collection: { items: [], pagination: {} } });
        componentUnderTest.parentObject = { objectType: 'collection', objectId: 1 };

        componentUnderTest.commentsExist.take(1).subscribe(result => expect(result).toBe(false));
      });
    });

    describe('onEditButtonClick()', () => {
      it('calls mergeNewValues() on the form', () => {
        componentUnderTest.onEditCommentButtonClick({ some: 'comment' } as any);

        expect(mockWzForm.mergeNewValues).toHaveBeenCalledWith([{ name: 'some', value: 'comment' }]);
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
      it('returns \'COMMENTS.SUBMIT_BTN_LABEL\' when the formMode is \'ADD\'', () => {
        expect(componentUnderTest.formSubmitLabel).toBe('COMMENTS.SUBMIT_BTN_LABEL');
      });

      it('returns \'COMMENTS.SAVE_BTN_LABEL\' when the formMode is \'EDIT\'', () => {
        componentUnderTest.onEditCommentButtonClick({ some: 'comment' } as any); // force formMode to 'EDIT'

        expect(componentUnderTest.formSubmitLabel).toBe('COMMENTS.SAVE_BTN_LABEL');
      });
    });

    describe('onFormCancel()', () => {
      it('calls resetForm() on the wzForm', () => {
        componentUnderTest.onFormCancel();

        expect(mockWzForm.resetForm).toHaveBeenCalled();
      });
    });

    describe('onDeleteCommentButtonClick()', () => {
      it('dispatches the right action', () => {
        componentUnderTest.parentObject = { objectType: 'collection', objectId: 1 };
        componentUnderTest.onDeleteCommentButtonClick({ some: 'comment', id: 2 } as any);

        mockStore.expectDispatchFor(removeCommentSpy, 'collection', 1, 2);
      });
    });
  });
}
