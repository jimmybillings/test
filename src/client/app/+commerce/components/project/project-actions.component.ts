import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { AssetLineItem, QuoteType } from '../../../shared/interfaces/commerce.interface';
@Component({
  moduleId: module.id,
  selector: 'project-actions-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      md-button
      type="button"
      data-pendo="cart-project_pricing-btn"
      *ngIf="showRightsPricingBtn"
      (click)="editProjectPricing()" 
      class="is-outlined rights-pkg"
      [ngClass]="{'select-usage': !rmAssetsHaveAttributes }">
      <md-icon>assignment</md-icon>
      {{ 'CART.PROJECTS.EDIT_USAGE_BTN_LABEL' | translate }}
    </button>
    <button
      data-pendo="cart-project_options-menu-trigger"
      md-icon-button 
      [md-menu-trigger-for]="projectOptionsMenu" 
      title="{{ 'CART.PROJECTS.MORE_OPTIONS_BTN_TITLE' | translate }}">
      <md-icon>more_vert</md-icon>
    </button>

    <md-menu x-position="before" #projectOptionsMenu="mdMenu">
      <button md-menu-item (click)="onEditButtonClick()">
        <md-icon>edit</md-icon>{{ 'CART.PROJECTS.EDIT_PROJECT_BTN_TITLE' | translate }}
      </button>
      <ng-container *ngIf="allowQuoteAdministration">
        <button md-menu-item (click)="onAddFeeButtonClick()">
          <md-icon>note_add</md-icon>{{ 'CART.PROJECTS.ADD_FEE' | translate }}
        </button>
        <button md-menu-item (click)="onBulkImportClick()">
          <md-icon>library_add</md-icon>{{ 'QUOTE.BULK_IMPORT.TITLE' | translate }}
        </button>
        <div class="divider"></div>
      </ng-container>
      <button
        md-menu-item
        (click)="onRemoveButtonClick()">
        <md-icon>delete</md-icon>{{ 'CART.PROJECTS.DELETE_PROJECT_BTN' | translate }}
      </button>
    </md-menu>
  `
})
export class ProjectActionsComponent {
  @Input() quoteType: QuoteType;
  @Input() allowQuoteAdministration: boolean = false;
  @Input() projectHasRmAssets: boolean = false;
  @Input() rmAssetsHaveAttributes: boolean = false;
  @Output() remove: EventEmitter<null> = new EventEmitter();
  @Output() edit: EventEmitter<null> = new EventEmitter();
  @Output() addFee: EventEmitter<null> = new EventEmitter();
  @Output() bulkImport: EventEmitter<null> = new EventEmitter();
  @Output() projectActionsNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public onEditButtonClick(): void {
    this.edit.emit();
  }

  public onRemoveButtonClick(): void {
    this.remove.emit();
  }

  public onAddFeeButtonClick(): void {
    this.addFee.emit();
  }

  public editProjectPricing() {
    this.projectActionsNotify.emit({ type: 'EDIT_PROJECT_PRICING' });
  }

  public get showRightsPricingBtn(): boolean {
    return this.quoteType !== 'ProvisionalOrder' && this.projectHasRmAssets;
  }

  public onBulkImportClick(): void {
    this.bulkImport.emit();
  }
}
