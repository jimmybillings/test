import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { QuoteType } from '../../../shared/interfaces/commerce.interface';

@Component({
  moduleId: module.id,
  selector: 'line-item-actions-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tools" flex="100">
      <button
        md-icon-button
        *ngIf="displayPriceButton"
        [ngClass]="{'select-usage': needsAttributes }"
        title="{{ 'CART.PROJECTS.EDIT_USAGE_BTN_LABEL' | translate }}"
        (click)="showPricingDialog.emit()">
        <md-icon>assignment</md-icon>
      </button>
      <button 
        md-icon-button
        (click)="remove.emit()"
        title="{{ 'CART.PROJECTS.REMOVE_ASSET_BTN_HOVER' | translate }}">
          <md-icon>remove_circle</md-icon>
        </button>
      <button
        md-icon-button
        [md-menu-trigger-for]="lineItemOptionsMenu"
        title="{{ 'CART.PROJECTS.MORE_OPTIONS_BTN_HOVER' | translate }}">
          <md-icon>more_vert</md-icon>
      </button>
    </div>

    <md-menu x-position="before" #lineItemOptionsMenu="mdMenu">
      <button md-menu-item (click)="clone.emit()">
        <md-icon>control_point_duplicate</md-icon>{{ 'CART.PROJECTS.DUPLICATE_ASSET_BTN_LABEL' | translate }}
      </button>
      <div class="divider" *ngIf="otherProjectsExist"></div>
      <button md-menu-item *ngFor="let otherProject of otherProjects" (click)="moveTo.emit(otherProject)">
        <md-icon>swap_vert_circle</md-icon>
        {{ 'CART.PROJECTS.MOVE_TO' | translate:{projectName: otherProject.name} | slice:0:28 }}
      </button>
      <div class="divider" *ngIf="shouldShowSubclipButton"></div>
      <button md-menu-item (click)="editMarkers.emit()" *ngIf="userCanCreateSubclips">
        <md-icon>theaters</md-icon>
        <span>{{ trStringForSubclipping | translate }}</span>
      </button>
      <div class="divider"></div>
      <button md-menu-item (click)="openCostMultiplierForm.emit()" *ngIf="userCanAdministerQuotes">
        <md-icon>attach_money</md-icon>
        <span>{{ trStringForCostMultiplier | translate }}</span>
      </button>
      <button md-menu-item (click)="removeCostMultiplier.emit()" *ngIf="showDeleteCostMultiplierBtn">
        <md-icon>remove_circle</md-icon>
        <span>{{ 'QUOTE.REMOVE_MULTIPLIER' | translate }}</span>
      </button>
    </md-menu>
  `
})
export class LineItemActionsComponent {
  @Input() rightsReproduction: string;
  @Input() hasAttributes: boolean;
  @Input() otherProjects: any[];
  @Input() userCanCreateSubclips: boolean;
  @Input() userCanAdministerQuotes: boolean;
  @Input() assetIsSubclipped: boolean;
  @Input() quoteType: QuoteType;
  @Input() hasMultiplier: boolean;
  @Output() showPricingDialog: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @Output() clone: EventEmitter<any> = new EventEmitter();
  @Output() moveTo: EventEmitter<any> = new EventEmitter();
  @Output() editMarkers: EventEmitter<any> = new EventEmitter();
  @Output() openCostMultiplierForm: EventEmitter<null> = new EventEmitter();
  @Output() removeCostMultiplier: EventEmitter<null> = new EventEmitter();

  public get displayPriceButton(): boolean {
    return this.rightsReproduction === 'Rights Managed' && this.quoteType !== 'ProvisionalOrder';
  }

  public get needsAttributes(): boolean {
    return this.rightsReproduction === 'Rights Managed' && !this.hasAttributes;
  }

  public get shouldShowSubclipButton(): boolean {
    return this.userCanCreateSubclips && this.otherProjectsExist;
  }

  public get otherProjectsExist(): boolean {
    return this.otherProjects.length > 0;
  }

  public get trStringForSubclipping(): string {
    return this.assetIsSubclipped
      ? 'COLLECTION.SHOW.ASSET_MORE_MENU.EDIT_SUBCLIPPING'
      : 'COLLECTION.SHOW.ASSET_MORE_MENU.ADD_SUBCLIPPING';
  }

  public get trStringForCostMultiplier(): string {
    return this.hasMultiplier ? 'QUOTE.EDIT_MULTIPLIER_TITLE' : 'QUOTE.ADD_MULTIPLIER_TITLE';
  }

  public get showDeleteCostMultiplierBtn(): boolean {
    return this.userCanAdministerQuotes && this.hasMultiplier;
  }
}
