import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormFields } from '../../../../shared/interfaces/forms.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-form-dialog',
  template: `
    <div class="wz-dialog">
      <button md-icon-button md-dialog-close title="Close" type="button" class="close">
        <md-icon>close</md-icon>
      </button>
      <h1 *ngIf="title" md-dialog-title>{{ title | translate }}</h1>
      <md-dialog-content layout="row">
        <wz-form
          [items]="formItems"
          [includeCancel]="displayCancelButton"
          [cancelLabel]="cancelLabel"
          [submitLabel]="submitLabel"
          [autocomplete]="autocomplete"
          (formCancel)="onFormCancel()"
          (formSubmit)="onFormSubmit($event)"
          (cacheSuggestions)="onFormSuggestions($event)">
        </wz-form>
      </md-dialog-content>
    </div>
  `
})
export class WzFormDialogComponent {
  @Input() formItems: FormFields[];
  @Input() title: string;
  @Input() displayCancelButton: boolean;
  @Input() cancelLabel: string;
  @Input() submitLabel: string;
  @Input() autocomplete: string;

  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  private suggestions: any;

  public onFormCancel(): void {
    this.cancel.emit();
  }

  public onFormSubmit(results: any): void {
    this.submit.emit(Object.assign({}, results, this.suggestions ? { suggestions: this.suggestions } : {}));
  }

  public onFormSuggestions(suggestions: any): void {
    this.suggestions = suggestions;
  }
}
