import { Observable } from 'rxjs/Observable';

import * as CommentState from './comment.state';
import * as CommentActions from '../actions/comment.actions';
import { Comment } from '../../shared/interfaces/comment.interface';
import { StateSpecHelper } from '../spec-helpers/state.spec-helper';

export function main() {
  const stateSpecHelper: StateSpecHelper = new StateSpecHelper();

  describe('Comment Reducer', () => {
    stateSpecHelper.setReducerTestModules({
      actions: CommentActions,
      state: CommentState,
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['AddComment', 'EditComment', 'RemoveComment', 'GetComments'],
      customTests: [
        {
          it: 'changes the activeObjectType to the action\'s objectType',
          actionParameters: { objectType: 'collection' },
          previousState: { activeObjectType: null },
          expectedNextState: { activeObjectType: 'collection' }
        }
      ]
    });

    stateSpecHelper.generateTestsFor({
      actionClassName: ['AddCommentSuccess', 'EditCommentSuccess', 'RemoveCommentSuccess', 'GetCommentsSuccess'],
      customTests: [
        {
          it: 'adds the comments to the right part of the store and sets activeObjectType back to null',
          actionParameters: { comments: { items: [{ some: 'collection' }], pagination: {} } },
          previousState: { activeObjectType: 'collection' },
          expectedNextState: { activeObjectType: null, collection: { items: [{ some: 'collection' }], pagination: {} } }
        }
      ]
    });
  });
}
