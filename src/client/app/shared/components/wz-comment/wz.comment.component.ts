import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { FormFields } from '../../interfaces/forms.interface';
import { Comments, Comment } from '../../interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-comment',
  templateUrl: 'wz.comment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzCommentComponent {
  @Input() comments: Comments;
  @Input() formFields: FormFields;
  @Input() showCommentActions: boolean;
  @Output() commentSubmit: EventEmitter<Comment> = new EventEmitter();

  public onFormSubmit(comment: Comment): void {
    this.commentSubmit.emit(comment);
  }

  public get commentsExist(): boolean {
    return this.comments.items.length > 0;
  }
}
