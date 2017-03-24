import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { PurchaseType } from '../../../../shared/interfaces/quote.interface';

@Component({
  moduleId: module.id,
  selector: 'line-item-actions-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tools" flex="100">
      <button
        *ngIf="displayPriceButton"
        md-button color="primary"
        class="mini is-outlined"
        (click)="showPricingDialog.emit()">{{ 'CART.PROJECTS.EDIT_USAGE_BTN_LABEL' | translate }}
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
    </md-menu>
  `
})
export class LineItemActionsComponent {
  @Input() rightsManaged: string;
  @Input() otherProjects: any[];
  @Input() userCanCreateSubclips: any[];
  @Input() timeStart: number;
  @Input() quoteType: PurchaseType;
  @Output() showPricingDialog: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @Output() clone: EventEmitter<any> = new EventEmitter();
  @Output() moveTo: EventEmitter<any> = new EventEmitter();
  @Output() editMarkers: EventEmitter<any> = new EventEmitter();

  public get displayPriceButton(): boolean {
    return this.rightsManaged === 'Rights Managed' && this.quoteType !== 'ProvisionalOrder';
  }

  public get shouldShowSubclipButton(): boolean {
    return this.userCanCreateSubclips && this.otherProjects.length > 0;
  }

  public get otherProjectsExist(): boolean {
    return this.otherProjects.length > 0;
  }

  public get trStringForSubclipping(): string {
    return !this.timeStart ?
      'COLLECTION.SHOW.ASSET_MORE_MENU.EDIT_SUBCLIPPING' :
      'COLLECTION.SHOW.ASSET_MORE_MENU.ADD_SUBCLIPPING';
  }
}
