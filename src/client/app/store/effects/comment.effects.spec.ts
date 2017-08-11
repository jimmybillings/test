import { CommentEffects } from './comment.effects';
import * as CommentActions from '../actions/comment.actions';
import { EffectsSpecHelper, EffectTestParameters } from '../spec-helpers/effects.spec-helper';

export function main() {
  describe('Comment Effects', () => {
    let effectsSpecHelper: EffectsSpecHelper;

    function instantiator(): CommentEffects {
      return new CommentEffects(
        effectsSpecHelper.mockNgrxEffectsActions, effectsSpecHelper.mockStore, effectsSpecHelper.mockService
      );
    }

    beforeEach(() => {
      effectsSpecHelper = new EffectsSpecHelper();
    });

    describe('getComments', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'getComments',
          effectsInstantiator: instantiator,
          inputAction: {
            type: CommentActions.GetComments.Type,
            objectType: 'collection',
            objectId: 1
          },
          serviceMethod: {
            name: 'getCommentsFor',
            expectedArguments: ['collection', 1],
            returnsObservableOf: { items: [{ some: 'comment' }], pagination: {} }
          },
          outputActionFactory: {
            sectionName: 'comment',
            methodName: 'getCommentsSuccess',
            expectedArguments: [{ items: [{ some: 'comment' }], pagination: {} }]
          }
        });
      });
    });

    describe('addComment', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'addComment',
          effectsInstantiator: instantiator,
          inputAction: {
            type: CommentActions.AddComment.Type,
            objectType: 'collection',
            objectId: 1,
            comment: { some: 'comment' }
          },
          serviceMethod: {
            name: 'addCommentTo',
            expectedArguments: ['collection', 1, { some: 'comment' }],
            returnsObservableOf: { items: [{ some: 'comment' }], pagination: {} }
          },
          outputActionFactory: {
            sectionName: 'comment',
            methodName: 'addCommentSuccess',
            expectedArguments: [{ items: [{ some: 'comment' }], pagination: {} }]
          }
        });
      });
    });

    describe('editComment', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'editComment',
          effectsInstantiator: instantiator,
          inputAction: {
            type: CommentActions.EditComment.Type,
            objectType: 'collection',
            objectId: 1,
            comment: { some: 'comment' }
          },
          serviceMethod: {
            name: 'editComment',
            expectedArguments: ['collection', 1, { some: 'comment' }],
            returnsObservableOf: { items: [{ some: 'comment' }], pagination: {} }
          },
          outputActionFactory: {
            sectionName: 'comment',
            methodName: 'editCommentSuccess',
            expectedArguments: [{ items: [{ some: 'comment' }], pagination: {} }]
          }
        });
      });
    });

    describe('removeComment', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'removeComment',
          effectsInstantiator: instantiator,
          inputAction: {
            type: CommentActions.RemoveComment.Type,
            objectType: 'collection',
            objectId: 1,
            commentId: 2
          },
          serviceMethod: {
            name: 'removeComment',
            expectedArguments: ['collection', 1, 2],
            returnsObservableOf: { items: [{ some: 'comment' }], pagination: {} }
          },
          outputActionFactory: {
            sectionName: 'comment',
            methodName: 'removeCommentSuccess',
            expectedArguments: [{ items: [{ some: 'comment' }], pagination: {} }]
          }
        });
      });
    });
  });
}
