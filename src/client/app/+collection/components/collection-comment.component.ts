import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { FormFields } from '../../shared/interfaces/forms.interface';
import { Pojo } from '../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'collection-comment-component',
  templateUrl: 'collection-comment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionCommentComponent {
  @Output() commentSubmit: EventEmitter<Pojo> = new EventEmitter();
  public formFields: Array<any> = [
    {
      name: 'message',
      value: '',
      validation: '',
      type: 'text',
      label: 'Comment'
    },
    {
      name: 'visibility',
      value: 'Editors',
      validation: '',
      type: 'select',
      label: 'Visible',
      options: 'Myself,Editors,Everyone'
    }
  ];
  public comments: Array<any> = [];

  public onCommentSubmit(comment: { message: string, visibility: string }): void {
    this.comments.push(Object.assign({}, comment, {
      author: 'ross.edfort@wazeedigital.com',
      firstName: 'Ross',
      lastName: 'Edfort',
      createdOn: new Date()
    }));
  }

  public initials(comment: any): string {
    return comment.firstName[0].toUpperCase() + comment.lastName[0].toUpperCase();
  }
}
