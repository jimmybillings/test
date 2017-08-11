import { ActionFactory, InternalActionFactory } from './comment.actions';
import { ActionsSpecHelper } from '../spec-helpers/actions.spec-helper';

export function main() {
  describe('Action Factory', () => {
    let actionsSpecHelper: ActionsSpecHelper = new ActionsSpecHelper();

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'load',
        parameters: ['collection', 1]
      },
      expectedAction: {
        type: '[Comments] Load',
        objectType: 'collection',
        objectId: 1
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'formSubmit',
        parameters: ['collection', 1, { some: 'comment' }]
      },
      expectedAction: {
        type: '[Comment] Form Submit',
        objectType: 'collection',
        objectId: 1,
        comment: { some: 'comment' },
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: ActionFactory,
        name: 'remove',
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
        name: 'loadSuccess',
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
        name: 'formSubmitSuccess',
        parameters: [{ some: 'comments' }]
      },
      expectedAction: {
        type: '[Comment] Form Submit Success',
        comments: { some: 'comments' }
      }
    });

    actionsSpecHelper.generateTestFor({
      factoryMethod: {
        class: InternalActionFactory,
        name: 'removeSuccess',
        parameters: [{ some: 'comments' }]
      },
      expectedAction: {
        type: '[Comment] Remove Success',
        comments: { some: 'comments' }
      }
    });
  });
}
