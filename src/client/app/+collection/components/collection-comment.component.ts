import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { FormFields } from '../../shared/interfaces/forms.interface';
import { Comments, Comment } from '../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'collection-comment-component',
  templateUrl: 'collection-comment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionCommentComponent {
  @Input() comments: Comments;
  @Input() formFields: FormFields;
  @Input() showCommentActions: boolean;
  @Output() commentSubmit: EventEmitter<Comment> = new EventEmitter();

  public onCommentSubmit(comment: Comment): void {
    this.commentSubmit.emit(comment);
  }

  public get commentsExist(): boolean {
    return this.comments.items.length > 0;
  }
}
