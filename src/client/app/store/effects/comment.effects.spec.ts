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
            type: CommentActions.Load.Type,
            parentObject: { objectType: 'collection', objectId: 1 }
          },
          serviceMethod: {
            name: 'getCommentsFor',
            expectedArguments: [{ objectType: 'collection', objectId: 1 }],
            returnsObservableOf: { items: [{ some: 'comment' }], pagination: {} }
          },
          outputActionFactory: {
            sectionName: 'comment',
            methodName: 'loadSuccess',
            expectedArguments: [{ items: [{ some: 'comment' }], pagination: {} }]
          }
        });
      });
    });

    describe('formSubmit', () => {
      beforeEach(() => {
        effectsSpecHelper = new EffectsSpecHelper();
      });

      it('works as expected for edit', () => {
        effectsSpecHelper.generateStandardTestFor({
          state: [
            { storeSectionName: 'comment', propertyName: 'formMode', value: 'EDIT' },
            { storeSectionName: 'comment', propertyName: 'commentBeingEdited', value: { old: 'comment' } }
          ],
          effectName: 'formSubmit',
          effectsInstantiator: instantiator,
          inputAction: {
            type: CommentActions.FormSubmit.Type,
            parentObject: { objectType: 'collection', objectId: 1 },
            comment: { some: 'comment' }
          },
          serviceMethod: {
            name: 'editComment',
            expectedArguments: [{ objectType: 'collection', objectId: 1 }, { old: 'comment' }],
            returnsObservableOf: { items: [{ some: 'comment' }], pagination: {} }
          },
          outputActionFactory: {
            sectionName: 'comment',
            methodName: 'formSubmitSuccess',
            expectedArguments: [{ items: [{ some: 'comment' }], pagination: {} }]
          }
        });
      });

      it('works as expected for add', () => {
        effectsSpecHelper.generateStandardTestFor({
          state: { storeSectionName: 'comment', propertyName: 'formMode', value: 'ADD' },
          effectName: 'formSubmit',
          effectsInstantiator: instantiator,
          inputAction: {
            type: CommentActions.FormSubmit.Type,
            parentObject: { objectType: 'collection', objectId: 1 },
            comment: { some: 'comment' }
          },
          serviceMethod: {
            name: 'addCommentTo',
            expectedArguments: [{ objectType: 'collection', objectId: 1 }, { some: 'comment' }],
            returnsObservableOf: { items: [{ some: 'comment' }], pagination: {} }
          },
          outputActionFactory: {
            sectionName: 'comment',
            methodName: 'formSubmitSuccess',
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
            type: CommentActions.Remove.Type,
            parentObject: { objectType: 'collection', objectId: 1 },
            commentId: 2
          },
          serviceMethod: {
            name: 'removeComment',
            expectedArguments: [{ objectType: 'collection', objectId: 1 }, 2],
            returnsObservableOf: { items: [{ some: 'comment' }], pagination: {} }
          },
          outputActionFactory: {
            sectionName: 'comment',
            methodName: 'removeSuccess',
            expectedArguments: [{ items: [{ some: 'comment' }], pagination: {} }]
          }
        });
      });
    });

    describe('showSnackBarOnRemoveSuccess', () => {
      it('works as expected', () => {
        effectsSpecHelper.generateStandardTestFor({
          effectName: 'showSnackBarOnRemoveSuccess',
          effectsInstantiator: instantiator,
          inputAction: {
            type: CommentActions.RemoveSuccess.Type
          },
          outputActionFactory: {
            sectionName: 'snackbar',
            methodName: 'display',
            expectedArguments: ['COMMENTS.DELETE_SUCCESS_TOAST']
          }
        });
      });
    });
  });
}
