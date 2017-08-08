import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { FormFields } from '../../interfaces/forms.interface';
import { Comments, Comment, CommentAccess } from '../../interfaces/common.interface';
import { WzFormComponent } from '../../modules/wz-form/wz.form.component';
import { Capabilities } from '../../services/capabilities.service';

@Component({
  moduleId: module.id,
  selector: 'wz-comment',
  templateUrl: 'wz.comment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzCommentComponent {
  @Input() comments: Comments;
  @Input() formFields: Array<FormFields>;
  @Input() showEditCommentButton: boolean;
  @Output() addCommentSubmit: EventEmitter<Comment> = new EventEmitter();
  @Output() editCommentSubmit: EventEmitter<Comment> = new EventEmitter();
  @ViewChild(WzFormComponent) wzForm: WzFormComponent;
  private formMode: 'ADD' | 'EDIT' = 'ADD';
  private commentToEdit: Comment;

  public onFormSubmit(comment: Comment): void {
    if (this.formMode === 'ADD') {
      this.addCommentSubmit.emit(comment);
    } else {
      let editedComment: Comment = Object.assign({}, this.commentToEdit, comment);
      this.editCommentSubmit.emit(editedComment);
      this.formMode = 'ADD';
    }
    this.wzForm.resetForm();
  }

  public get commentsExist(): boolean {
    return this.comments.items.length > 0;
  }

  public onEditCommentButtonClick(comment: Comment): void {
    this.commentToEdit = comment;
    this.formMode = 'EDIT';
    let newFormFields: Array<FormFields> = this.formFields.map((field: FormFields) => {
      field.value = comment[field.name];
      return field;
    });
    this.wzForm.mergeNewValues(newFormFields);
  }
}
