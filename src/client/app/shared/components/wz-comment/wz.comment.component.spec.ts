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
          componentUnderTest.formFields = [{ name: 'some', value: '' }] as any;
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
      beforeEach(() => {
        componentUnderTest.formFields = [{ name: 'some', value: '' }] as any;
      });

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
  });
}
