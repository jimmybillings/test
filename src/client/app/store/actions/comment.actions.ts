import { Action } from '@ngrx/store';

import { Comment, Comments, ObjectType } from '../../shared/interfaces/comment.interface';

export class ActionFactory {
  public getComments(objectType: ObjectType, objectId: number): GetComments {
    return new GetComments(objectType, objectId);
  }

  public addComment(objectType: ObjectType, objectId: number, comment: Comment): AddComment {
    return new AddComment(objectType, objectId, comment);
  }

  public editComment(objectType: ObjectType, objectId: number, comment: Comment): EditComment {
    return new EditComment(objectType, objectId, comment);
  }

  public removeComment(objectType: ObjectType, objectId: number, commentId: number): RemoveComment {
    return new RemoveComment(objectType, objectId, commentId);
  }
}

export class InternalActionFactory {
  public getCommentsSuccess(comments: Comments): GetCommentsSuccess {
    return new GetCommentsSuccess(comments);
  }

  public addCommentSuccess(comments: Comments): AddCommentSuccess {
    return new AddCommentSuccess(comments);
  }

  public editCommentSuccess(comments: Comments): EditCommentSuccess {
    return new EditCommentSuccess(comments);
  }

  public removeCommentSuccess(comments: Comments): RemoveCommentSuccess {
    return new RemoveCommentSuccess(comments);
  }
}

export class GetComments implements Action {
  public static readonly Type = '[Comments] Get';
  public readonly type = GetComments.Type;
  constructor(public readonly objectType: ObjectType, public readonly objectId: number) { }
}

export class AddComment implements Action {
  public static readonly Type = '[Comment] Add';
  public readonly type = AddComment.Type;
  constructor(public readonly objectType: ObjectType, public readonly objectId: number, public readonly comment: Comment) { }
}

export class EditComment implements Action {
  public static readonly Type = '[Comment] Edit';
  public readonly type = EditComment.Type;
  constructor(public readonly objectType: ObjectType, public readonly objectId: number, public readonly comment: Comment) { }
}

export class RemoveComment implements Action {
  public static readonly Type = '[Comment] Remove';
  public readonly type = RemoveComment.Type;
  constructor(public readonly objectType: ObjectType, public readonly objectId: number, public readonly commentId: number) { }
}

export class GetCommentsSuccess implements Action {
  public static readonly Type = '[Comments] Get Success';
  public readonly type = GetCommentsSuccess.Type;
  constructor(public readonly comments: Comments) { }
}

export class AddCommentSuccess implements Action {
  public static readonly Type = '[Comment] Add Success';
  public readonly type = AddCommentSuccess.Type;
  constructor(public readonly comments: Comments) { }
}

export class EditCommentSuccess implements Action {
  public static readonly Type = '[Comment] Edit Success';
  public readonly type = EditCommentSuccess.Type;
  constructor(public readonly comments: Comments) { }
}

export class RemoveCommentSuccess implements Action {
  public static readonly Type = '[Comment] Remove Success';
  public readonly type = RemoveCommentSuccess.Type;
  constructor(public readonly comments: Comments) { }
}

export type Any = GetComments | AddComment | AddCommentSuccess | EditComment |
  GetCommentsSuccess | EditCommentSuccess | RemoveComment | RemoveCommentSuccess;
