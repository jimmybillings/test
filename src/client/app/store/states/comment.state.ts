import * as CommentActions from '../actions/comment.actions';
import { Comment, Comments, ObjectType, CommentFormMode } from '../../shared/interfaces/comment.interface';
import { Pagination } from '../../shared/interfaces/common.interface';

// I would love to take advantage of our ObjectType type here, but currently can't find a way to do it (R.E. 08/10/2017)
// for the time being, manually add to this interface when adding comments to cart, quote, etc.
// for reference: https://github.com/Microsoft/TypeScript/issues/2491 and https://github.com/Microsoft/TypeScript/pull/12114
export interface State {
  readonly formSubmitLabel: string;
  readonly commentBeingEdited: Comment;
  readonly activeObjectType: ObjectType;
  readonly formMode: CommentFormMode;
  readonly cart?: Comments;
  readonly collection?: Comments;
  readonly quote?: Comments;
}

const defaultCommentPagination: Pagination = { pageSize: 100, currentPage: 1, hasNextPage: false, hasPreviousPage: false };

export const initialState: State = {
  formSubmitLabel: 'COMMENTS.SUBMIT_BTN_LABEL',
  commentBeingEdited: null,
  activeObjectType: null,
  formMode: 'ADD',
  cart: { items: [], pagination: defaultCommentPagination },
  collection: { items: [], pagination: defaultCommentPagination },
  quote: { items: [], pagination: defaultCommentPagination }
};

export function reducer(state: State = initialState, action: CommentActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case CommentActions.ChangeFormModeToEdit.Type: {
      return {
        ...JSON.parse(JSON.stringify(state)),
        formMode: 'EDIT',
        formSubmitLabel: 'COMMENTS.SAVE_BTN_LABEL',
        commentBeingEdited: action.commentBeingEdited
      };
    }

    case CommentActions.ChangeFormModeToAdd.Type: {
      return {
        ...JSON.parse(JSON.stringify(state)),
        formMode: 'ADD',
        formSubmitLabel: 'COMMENTS.SUBMIT_BTN_LABEL',
        commentBeingEdited: null
      };
    }

    case CommentActions.Load.Type:
    case CommentActions.Remove.Type: {
      return {
        ...JSON.parse(JSON.stringify(state)),
        activeObjectType: action.parentObject.objectType
      };
    }

    case CommentActions.FormSubmitSuccess.Type:
    case CommentActions.RemoveSuccess.Type:
    case CommentActions.LoadSuccess.Type: {
      const stateClone: State = JSON.parse(JSON.stringify(state));
      return {
        ...stateClone,
        [stateClone.activeObjectType]: {
          ...action.comments
        },
        formMode: 'ADD',
        formSubmitLabel: 'COMMENTS.SUBMIT_BTN_LABEL',
        commentBeingEdited: null
      };
    }

    case CommentActions.FormSubmit.Type: {
      const stateClone: State = JSON.parse(JSON.stringify(state));

      return {
        ...stateClone,
        commentBeingEdited: {
          ...stateClone.commentBeingEdited, ...action.comment
        }
      };
    }

    default: {
      return state;
    }
  }
}
