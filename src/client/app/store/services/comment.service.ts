import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { CommentsApiResponse, Comments, Comment, ObjectType } from '../../shared/interfaces/comment.interface';

@Injectable()
export class CommentService {
  constructor(private apiService: ApiService) { }

  public getCommentsFor(objectType: ObjectType, objectId: number): Observable<Comments> {
    return this.apiService.get(
      Api.Identities,
      `comment/byType/${objectType}/${objectId}`
    ).map(this.convertToComments);
  }

  public addCommentTo(objectType: ObjectType, objectId: number, comment: Comment): Observable<Comments> {
    return this.apiService.post(
      Api.Identities,
      `comment/byType/${objectType}/${objectId}`,
      { body: comment, loadingIndicator: true }
    ).flatMap(() => this.getCommentsFor(objectType, objectId));
  }

  public editComment(objectType: ObjectType, objectId: number, comment: Comment): Observable<Comments> {
    return this.apiService.put(
      Api.Identities,
      `comment/${comment.id}`,
      { body: comment, loadingIndicator: true }
    ).flatMap(() => this.getCommentsFor(objectType, objectId));
  }

  public removeComment(objectType: ObjectType, objectId: number, commentId: number): Observable<Comments> {
    return this.apiService.delete(
      Api.Identities,
      `comment/${commentId}`,
      { loadingIndicator: true }
    ).flatMap(() => this.getCommentsFor(objectType, objectId));
  }

  private convertToComments = (comments: CommentsApiResponse): Comments => {
    return {
      items: comments.items || [],
      pagination: {
        currentPage: comments.currentPage,
        numberOfPages: comments.numberOfPages,
        hasNextPage: comments.hasNextPage,
        hasPreviousPage: comments.hasPreviousPage,
        pageSize: comments.pageSize,
        totalCount: comments.totalCount
      }
    };
  }
}
