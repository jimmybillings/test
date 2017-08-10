import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { FormFields } from '../../interfaces/forms.interface';
import { Comments, Comment } from '../../interfaces/common.interface';
import { WzFormComponent } from '../../modules/wz-form/wz.form.component';
import { Capabilities } from '../../services/capabilities.service';
import { WzDialogService } from '../../modules/wz-dialog/services/wz.dialog.service';

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
  @Output() deleteComment: EventEmitter<number> = new EventEmitter();
  @ViewChild(WzFormComponent) wzForm: WzFormComponent;
  private formMode: 'ADD' | 'EDIT' = 'ADD';
  private commentToEdit: Comment;

  constructor(private wzDialogService: WzDialogService) { }

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

  public initials(userName: string): string {
    let [firstName, lastName] = userName.split(' ');
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  }

  public get formSubmitLabel(): string {
    return this.formMode === 'ADD' ? 'COMMENTS.SUBMIT_BTN_LABEL' : 'COMMENTS.SAVE_BTN_LABEL';
  }

  public onFormCancel(): void {
    this.formMode = 'ADD';
    this.wzForm.resetForm();
    this.commentToEdit = null;
  }

  public onDeleteCommentButtonClick(comment: Comment): void {
    this.wzDialogService.openConfirmationDialog({
      title: 'Are you sure you want to delete this comment?',
      accept: 'Yes, I\'m Sure',
      decline: 'No'
    }, () => this.deleteComment.emit(comment.id));
  }
}
