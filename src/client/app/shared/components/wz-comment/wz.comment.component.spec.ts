import { WzCommentComponent } from './wz.comment.component';

export function main() {
  describe('Collection Comment Component', () => {
    let componentUnderTest: WzCommentComponent;

    beforeEach(() => {
      componentUnderTest = new WzCommentComponent();
    });

    describe('onCommentSubmit', () => {
      it('should emit the \'commentSubmit\' event with the comment', () => {
        spyOn(componentUnderTest.commentSubmit, 'emit');
        componentUnderTest.onCommentSubmit({ some: 'comment' } as any);

        expect(componentUnderTest.commentSubmit.emit).toHaveBeenCalledWith({ some: 'comment' });
      });
    });
  });
}
