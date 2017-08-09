import { WzCommentComponent } from './wz.comment.component';

export function main() {
  describe('Wz Comment Component', () => {
    let componentUnderTest: WzCommentComponent, mockWzForm: any;

    beforeEach(() => {
      componentUnderTest = new WzCommentComponent();
      mockWzForm = {
        resetForm: jasmine.createSpy('resetForm'),
        mergeNewValues: jasmine.createSpy('mergeNewValues')
      };
      componentUnderTest.wzForm = mockWzForm;
      componentUnderTest.formFields = [{ name: 'some', value: '' }] as any;
    });

    describe('onCommentSubmit', () => {
      describe('for adding a comment', () => {
        it('should emit the \'addCommentSubmit\' event with the comment', () => {
          spyOn(componentUnderTest.addCommentSubmit, 'emit');
          componentUnderTest.onFormSubmit({ some: 'comment' } as any);

          expect(componentUnderTest.addCommentSubmit.emit).toHaveBeenCalledWith({ some: 'comment' });
        });
      });

      describe('for editing a comment', () => {
        beforeEach(() => {

          componentUnderTest.onEditCommentButtonClick({ some: 'comment' } as any);
        });

        it('emits the \'editCommentSubmit\' event with the new comment', () => {
          spyOn(componentUnderTest.editCommentSubmit, 'emit');
          componentUnderTest.onFormSubmit({ the: 'newComment' } as any);

          expect(componentUnderTest.editCommentSubmit.emit).toHaveBeenCalledWith({ some: 'comment', the: 'newComment' });
        });
      });

      it('resets the form', () => {
        componentUnderTest.onFormSubmit({ some: 'comment' } as any);

        expect(componentUnderTest.wzForm.resetForm).toHaveBeenCalled();
      });
    });

    describe('get commentsExist()', () => {
      it('returns true if there are comments', () => {
        componentUnderTest.comments = { items: [{ some: 'comment' }] } as any;

        expect(componentUnderTest.commentsExist).toBe(true);
      });

      it('returns false if there are no comments', () => {
        componentUnderTest.comments = { items: [] } as any;

        expect(componentUnderTest.commentsExist).toBe(false);
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

    describe('get includeFormCancel', () => {
      it('returns false when the formMode is \'ADD\'', () => {
        expect(componentUnderTest.includeFormCancel).toBe(false);
      });

      it('returns true when the formMode is \'EDIT\'', () => {
        componentUnderTest.onEditCommentButtonClick({ some: 'comment' } as any); // force formMode to 'EDIT'

        expect(componentUnderTest.includeFormCancel).toBe(true);
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
  });
}
