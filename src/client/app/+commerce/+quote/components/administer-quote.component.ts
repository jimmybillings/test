import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'administer-quote-component',
  template: `
    <div flex="100" layout-gt-xs="row" layout="column" layout-align="space-between end" layout-align-xs="end end">
      <div class="reject-quote" flex-gt-xs="auto" flex="100" flex-order-xs="2">	
        <button md-button color="primary" (click)="onOpenDeleteDialog()">
          <md-icon>delete</md-icon>{{ 'QUOTE.DELETE_BTN' | translate }}
        </button>
      </div>
      <section flex-gt-xs="65" flex="100" class="action-items" flex-order-xs="-1">
        <button
        md-button
        color="primary"
        [disabled]="!shouldShowCloneButton"
        (click)="onClickCloneQuoteButton()">
        {{ 'QUOTE.CLONE_QUOTE' | translate }}
        </button>
        <button
        md-button
        color="primary"
        (click)="onSaveAndNew()">
        {{ 'QUOTE.SAVE_AND_NEW' | translate }}
        </button>
        <button
          [disabled]="!canOpenQuoteDialog"
          md-raised-button
          color="primary"
          (click)="onOpenQuoteDialog()">
          {{ 'QUOTE.CREATE_QUOTE_BTN' | translate }}
        </button>
      </section>
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

  public onClickCloneQuoteButton() {
    this.cloneQuote.emit();
  }

  public onSaveAsDraft() {
    this.saveAsDraft.emit();
  }
}
