import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { AssetLineItem } from '../../../shared/interfaces/commerce.interface';
@Component({
  moduleId: module.id,
  selector: 'project-actions-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-button type="button"
      *ngIf="projectHasRmAssets"
      (click)="editProjectPricing()" 
      class="is-outlined rights-pkg"
      [ngClass]="{'select-usage': !rmAssetsHaveAttributes }">
      <md-icon>assignment</md-icon>
      {{ 'CART.PROJECTS.EDIT_USAGE_BTN_LABEL' | translate }}
    </button>
    <button md-icon-button (click)="onEditButtonClick()" title="{{ 'CART.PROJECTS.EDIT_PROJECT_BTN_TITLE' | translate }}">
      <md-icon>edit</md-icon>
    </button>
    <button md-icon-button 
      [md-menu-trigger-for]="projectOptionsMenu" 
      title="{{ 'CART.PROJECTS.MORE_OPTIONS_BTN_TITLE' | translate }}">
      <md-icon>more_vert</md-icon>
    </button>
    <md-menu x-position="before" #projectOptionsMenu="mdMenu">
      <button disabled md-menu-item><md-icon>attachment</md-icon>{{ 'CART.PROJECTS.ADD_PACKAGE' | translate }}</button>
      <button [disabled]="!includeFees" md-menu-item (click)="onAddFeeButtonClick()">
        <md-icon>note_add</md-icon>{{ 'CART.PROJECTS.ADD_FEE' | translate }}
      </button>
      <div class="divider"></div>
      <button md-menu-item (click)="onRemoveButtonClick()"> <md-icon>delete</md-icon>{{ 'CART.PROJECTS.DELETE_PROJECT_BTN' | translate }}
      </button>
    </md-menu>
  `
})
export class ProjectActionsComponent {
  @Input() includeFees: boolean = false;
  @Input() projectHasRmAssets: boolean = false;
  @Input() rmAssetsHaveAttributes: boolean = false;
  @Output() remove: EventEmitter<null> = new EventEmitter();
  @Output() edit: EventEmitter<null> = new EventEmitter();
  @Output() addFee: EventEmitter<null> = new EventEmitter();
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
}
