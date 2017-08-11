import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppStore } from '../../../app.store';
import { FormFields } from '../../interfaces/forms.interface';
import { Comments, Comment, ObjectType } from '../../interfaces/comment.interface';
import { WzFormComponent } from '../../modules/wz-form/wz.form.component';
import { Capabilities } from '../../services/capabilities.service';

@Component({
  moduleId: module.id,
  selector: 'wz-comment',
  templateUrl: 'wz.comment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzCommentComponent {
  @Input()
  set parentObject(commentObject: { objectType: ObjectType, objectId: number }) {
    this._parentObject = commentObject;
    this.initializeData();
  }
  @Input() formFields: Array<FormFields>;
  @Input() showEditCommentButton: boolean;
  @ViewChild(WzFormComponent) wzForm: WzFormComponent;
  public comments: Observable<Comments>;
  private formMode: 'ADD' | 'EDIT' = 'ADD';
  private commentToEdit: Comment;
  private _parentObject: { objectType: ObjectType, objectId: number };

  constructor(private store: AppStore) { }

  public onFormSubmit(comment: Comment): void {
    if (this.formMode === 'ADD') {
      this.store.dispatch(factory => factory.comment.addComment(this._parentObject.objectType, this._parentObject.objectId, comment));
    } else {
      let editedComment: Comment = Object.assign({}, this.commentToEdit, comment);
      this.store.dispatch(factory =>
        factory.comment.editComment(this._parentObject.objectType, this._parentObject.objectId, editedComment));
      this.toggleFormMode();
    }
    this.wzForm.resetForm();
  }

  public get commentsExist(): Observable<boolean> {
    return this.comments.map(comments => comments.items.length > 0);
  }

  public onEditCommentButtonClick(comment: Comment): void {
    this.commentToEdit = comment;
    this.toggleFormMode();
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
    this.toggleFormMode();
    this.wzForm.resetForm();
    this.commentToEdit = null;
  }

  public onDeleteCommentButtonClick(comment: Comment): void {
    this.store.dispatch(factory => factory.comment.removeComment(this._parentObject.objectType, this._parentObject.objectId, comment.id));
  }

  private initializeData(): void {
    this.store.dispatch(factory => factory.comment.getComments(this._parentObject.objectType, this._parentObject.objectId));
    this.comments = this.store.select(state => state.comment[this._parentObject.objectType]);
  }

  private toggleFormMode(): void {
    this.formMode === 'ADD' ? this.formMode = 'EDIT' : this.formMode = 'ADD';
  }
}
