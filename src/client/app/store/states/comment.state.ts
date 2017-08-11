import * as CommentActions from '../actions/comment.actions';
import { Comment, Comments, ObjectType } from '../../shared/interfaces/comment.interface';
import { Pagination } from '../../shared/interfaces/common.interface';

// I would love to take advantage of our ObjectType type here, but currently can't find a way to do it (R.E. 08/10/2017)
// for the time being, manually add to this interface when adding comments to cart, quote, etc.
// for reference: https://github.com/Microsoft/TypeScript/issues/2491 and https://github.com/Microsoft/TypeScript/pull/12114
export interface State {
  readonly activeObjectType: ObjectType;
  readonly cart?: Comments;
  readonly collection?: Comments;
  readonly quote?: Comments;
}

const defaultCommentPagination: Pagination = { pageSize: 100, currentPage: 1, hasNextPage: false, hasPreviousPage: false };

export const initialState: State = {
  activeObjectType: null,
  cart: { items: [], pagination: defaultCommentPagination },
  collection: { items: [], pagination: defaultCommentPagination },
  quote: { items: [], pagination: defaultCommentPagination }
};

export function reducer(state: State = initialState, action: CommentActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case CommentActions.GetComments.Type:
    case CommentActions.AddComment.Type:
    case CommentActions.EditComment.Type:
    case CommentActions.RemoveComment.Type: {
      return {
        ...JSON.parse(JSON.stringify(state)),
        activeObjectType: action.objectType
      };
    }

    case CommentActions.AddCommentSuccess.Type:
    case CommentActions.EditCommentSuccess.Type:
    case CommentActions.RemoveCommentSuccess.Type:
    case CommentActions.GetCommentsSuccess.Type: {
      const stateClone: State = JSON.parse(JSON.stringify(state));
      return {
        ...stateClone,
        [stateClone.activeObjectType]: {
          ...action.comments
        },
        activeObjectType: null
      };
    }

    default: {
      return state;
    }
  }
}
