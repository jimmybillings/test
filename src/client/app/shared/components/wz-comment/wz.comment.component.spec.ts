import { WzCommentComponent } from './wz.comment.component';

export function main() {
  describe('Wz Comment Component', () => {
    let componentUnderTest: WzCommentComponent;

    beforeEach(() => {
      componentUnderTest = new WzCommentComponent();
      componentUnderTest.wzForm = { resetForm: jasmine.createSpy('resetForm') } as any;
    });

    describe('onCommentSubmit', () => {
      it('should emit the \'commentSubmit\' event with the comment', () => {
        spyOn(componentUnderTest.addCommentSubmit, 'emit');
        componentUnderTest.onFormSubmit({ some: 'comment' } as any);

        expect(componentUnderTest.addCommentSubmit.emit).toHaveBeenCalledWith({ some: 'comment' });
      });

      it('resets the form', () => {
        componentUnderTest.onFormSubmit({ some: 'comment' } as any);

        expect(componentUnderTest.wzForm.resetForm).toHaveBeenCalled();
      });
    });
  });
}
