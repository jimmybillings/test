import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppStore } from '../../../app.store';
import { FormFields } from '../../interfaces/forms.interface';
import { Comments, Comment, ObjectType, CommentParentObject, CommentFormMode } from '../../interfaces/comment.interface';
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
  set parentObject(parentObject: CommentParentObject) {
    this._parentObject = parentObject;
    this.initializeData();
  }
  @Input() formFields: Array<FormFields>;
  @Input() userCanAddComments: boolean;
  @Input() currentUserId: number;
  @ViewChild(WzFormComponent) wzForm: WzFormComponent;
  private _parentObject: CommentParentObject;

  constructor(private store: AppStore) { }

  public get commentsExist(): Observable<boolean> {
    return this.comments.map(comments => comments.items.length > 0);
  }

  public initials(userName: string): string {
    let [firstName, lastName] = userName.split(' ');
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  }

  public get formSubmitLabel(): Observable<string> {
    return this.store.select(factory => factory.comment.formSubmitLabel);
  }

  public onFormSubmit(comment: Comment): void {
    this.store.dispatch(factory => factory.comment.formSubmit(this._parentObject, comment));
    this.wzForm.resetForm();
  }

  public onEditCommentButtonClick(comment: Comment): void {
    this.store.dispatch(factory => factory.comment.changeFormModeToEdit(comment));
    let newFormFields: Array<FormFields> = this.formFields.map((field: FormFields) => {
      field.value = comment[field.name];
      return field;
    });
    this.wzForm.mergeNewValues(newFormFields);
  }

  public onFormCancel(): void {
    this.store.dispatch(factory => factory.comment.changeFormModeToAdd());
    this.wzForm.resetForm();
  }

  public onDeleteCommentButtonClick(comment: Comment): void {
    this.store.dispatch(factory => factory.dialog.showConfirmation(
      {
        title: 'COMMENTS.DELETE_CONFIRMATION.TITLE',
        accept: 'COMMENTS.DELETE_CONFIRMATION.ACCEPT',
        decline: 'COMMENTS.DELETE_CONFIRMATION.DECLINE'
      },
      () => this.store.dispatch(factory => factory.comment.remove(this._parentObject, comment.id))
    ));
  }

  public get comments(): Observable<Comments> {
    return this.store.select(state => state.comment[this._parentObject.objectType]);
  }

  public showEditCommentButton(commentOwnerId: number): boolean {
    return commentOwnerId === this.currentUserId;
  }

  public showDeleteCommentButton(commentOwnerId: number): boolean {
    return commentOwnerId === this.currentUserId;
  }

  private initializeData(): void {
    this.store.dispatch(factory => factory.comment.load(this._parentObject));
  }
}
