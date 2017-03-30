import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'quote-form-component',
  template: `
    <div class="wz-dialog">
      <button md-icon-button md-dialog-close title="Close" type="button" class="close">
        <md-icon>close</md-icon>
      </button>
      <h1 md-dialog-title>
        {{ 'QUOTE.CREATE_HEADER' | translate }}
      </h1>
      <md-dialog-content style="min-height: 260px;">
        <wz-form
          [items]="items"
          submitLabel="{{ 'QUOTE.SEND_BTN' | translate }}"
          (formSubmit)="dialog.close($event)"
          (cacheSuggestions)="cacheSuggestions.emit($event)"
          autocomplete="off"
        ></wz-form>
      </md-dialog-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteFormComponent {
  @Input() items: any[];
  @Input() dialog: any;
  @Output() cacheSuggestions: any = new EventEmitter();
}
