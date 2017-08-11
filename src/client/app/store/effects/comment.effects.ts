import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import * as CommentActions from '../actions/comment.actions';
import { Comment, Comments } from '../../shared/interfaces/comment.interface';
import { CommentService } from '../services/comment.service';
import { AppStore, AppState } from '../../app.store';

@Injectable()
export class CommentEffects {
  @Effect()
  public getComments: Observable<Action> = this.actions.ofType(CommentActions.GetComments.Type)
    .switchMap((action: CommentActions.GetComments) =>
      this.service.getCommentsFor(action.objectType, action.objectId))
    .map((comments: Comments) => this.store.create(factory => factory.comment.getCommentsSuccess(comments)));

  @Effect()
  public addComment: Observable<Action> = this.actions.ofType(CommentActions.AddComment.Type)
    .switchMap((action: CommentActions.AddComment) =>
      this.service.addCommentTo(action.objectType, action.objectId, action.comment))
    .map((comments: Comments) => this.store.create(factory => factory.comment.addCommentSuccess(comments)));

  @Effect()
  public editComment: Observable<Action> = this.actions.ofType(CommentActions.EditComment.Type)
    .switchMap((action: CommentActions.EditComment) =>
      this.service.editComment(action.objectType, action.objectId, action.comment))
    .map((comments: Comments) => this.store.create(factory => factory.comment.editCommentSuccess(comments)));

  @Effect()
  public removeComment: Observable<Action> = this.actions.ofType(CommentActions.RemoveComment.Type)
    .switchMap((action: CommentActions.RemoveComment) =>
      this.service.removeComment(action.objectType, action.objectId, action.commentId))
    .map((comments: Comments) => this.store.create(factory => factory.comment.removeCommentSuccess(comments)));

  constructor(
    private actions: Actions,
    private store: AppStore,
    private service: CommentService
  ) { }
}
