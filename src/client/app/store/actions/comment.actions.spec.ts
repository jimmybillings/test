import { ActionFactory, InternalActionFactory } from './comment.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'getComments',
        parameters: ['collection', 1]
      },
      expectedAction: {
        type: '[Comments] Get',
        objectType: 'collection',
        objectId: 1
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'addComment',
        parameters: ['collection', 1, { some: 'comment' }]
      },
      expectedAction: {
        type: '[Comment] Add',
        objectType: 'collection',
        objectId: 1,
        comment: { some: 'comment' },
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'editComment',
        parameters: ['collection', 1, { some: 'comment' }]
      },
      expectedAction: {
        type: '[Comment] Edit',
        objectType: 'collection',
        objectId: 1,
        comment: { some: 'comment' },
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'removeComment',
        parameters: ['collection', 1, 2]
      },
      expectedAction: {
        type: '[Comment] Remove',
        objectType: 'collection',
        objectId: 1,
        commentId: 2,
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'getCommentsSuccess',
        parameters: [{ some: 'comments' }]
      },
      expectedAction: {
        type: '[Comments] Get Success',
        comments: { some: 'comments' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'addCommentSuccess',
        parameters: [{ some: 'comments' }]
      },
      expectedAction: {
        type: '[Comment] Add Success',
        comments: { some: 'comments' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'editCommentSuccess',
        parameters: [{ some: 'comments' }]
      },
      expectedAction: {
        type: '[Comment] Edit Success',
        comments: { some: 'comments' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'removeCommentSuccess',
        parameters: [{ some: 'comments' }]
      },
      expectedAction: {
        type: '[Comment] Remove Success',
        comments: { some: 'comments' }
      }
    });
  });
}
