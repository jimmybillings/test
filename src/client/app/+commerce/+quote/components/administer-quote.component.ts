import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'administer-quote-component',
  template: `
    <div flex="100" layout="column" layout-gt-sm="row" layout-align="end end">
      <div class="create-quote-actions">
        <button
          md-button
          [disabled]="!shouldShowCloneButton"
          class="large-text is-outlined"
          (click)="onCloneQuote()">
          {{ 'QUOTE.CLONE_QUOTE' | translate }}
        </button>
        <button
          md-button
          class="large-text is-outlined"
          (click)="onSaveAndNew()">
          {{ 'QUOTE.SAVE_AND_NEW' | translate }}
        </button>
        <button
          md-button
          class="large-text is-outlined"
          color="warn"
          (click)="onOpenDeleteDialog()">
          {{ 'QUOTE.DELETE_BTN' | translate }}
        </button>
        <button
          [disabled]="!canOpenQuoteDialog"
          md-raised-button class="checkout"
          (click)="onOpenQuoteDialog()">
          {{ 'QUOTE.CREATE_QUOTE_BTN' | translate }}
        </button>
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministerQuoteComponent {
  @Input() public userCanProceed: boolean;
  @Input() public shouldShowCloneButton: boolean;
  @Output() public saveAsDraft: EventEmitter<null> = new EventEmitter();
  @Output() public openQuoteDialog: EventEmitter<null> = new EventEmitter();
  @Output() public openDeleteDialog: EventEmitter<null> = new EventEmitter();
  @Output() public saveAndNew: EventEmitter<null> = new EventEmitter();
  @Output() public cloneQuote: EventEmitter<null> = new EventEmitter();

  public get canOpenQuoteDialog() {
    return this.userCanProceed;
  }

  public onSaveAndNew() {
    this.saveAndNew.emit();
  }

  public onOpenDeleteDialog() {
    this.openDeleteDialog.emit();
  }

  public onOpenQuoteDialog() {
    this.openQuoteDialog.emit();
  }

  public onCloneQuote() {
    this.cloneQuote.emit();
  }

  public onSaveAsDraft() {
    this.saveAsDraft.emit();
  }
}
