import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { CommentsApiResponse, Comments, Comment, ObjectType } from '../../shared/interfaces/common.interface';

@Injectable()
export class CommentService {
  constructor(private apiService: ApiService) { }

  public getCommentsFor(objectType: ObjectType, objectId: number): Observable<Comments> {
    return this.apiService.get(
      Api.Identities,
      `comment/byType/${objectType}/${objectId}`
    ).map(this.convertToComments);
  }

  public addCommentTo(objectType: ObjectType, objectId: number, comment: Comment): Observable<Comment> {
    return this.apiService.post(
      Api.Identities,
      `comment/byType/${objectType}/${objectId}`,
      { body: comment, loadingIndicator: true }
    );
  }

  public editComment(comment: Comment): Observable<Comment> {
    return this.apiService.put(
      Api.Identities,
      `comment/${comment.id}`,
      { body: comment, loadingIndicator: true }
    );
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
