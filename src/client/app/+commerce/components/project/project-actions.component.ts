import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'project-actions-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- CRUX-1715 -->
    <!--
    <button md-button  class="is-outlined" type="button">
      {{ 'CART.PROJECTS.EDIT_USAGE_BTN_LABEL' | translate }}
    </button>
    -->
    <button md-icon-button (click)="edit.emit()" title="Edit project details">
      <md-icon>edit</md-icon>
    </button>
    <button md-icon-button [md-menu-trigger-for]="projectOptionsMenu" title="More project options">
      <md-icon>more_vert</md-icon>
    </button>

    <md-menu x-position="before" #projectOptionsMenu="mdMenu">
      <button disabled md-menu-item><md-icon>attachment</md-icon>{{ 'CART.PROJECTS.ADD_PACKAGE' | translate }}</button>
      <button disabled md-menu-item><md-icon>receipt</md-icon>{{ 'CART.PROJECTS.ADD_FEE' | translate }}</button>
      <button md-menu-item><md-icon>add_to_photos</md-icon>{{ 'CART.PROJECTS.ADD_CLIPS' | translate }}</button>
      <div class="divider"></div>
      <button md-menu-item (click)="remove.emit()">
        <md-icon>delete</md-icon>{{ 'CART.PROJECTS.DELETE_PROJECT_BTN' | translate }}
      </button>
    </md-menu>
  `
})
export class ProjectActionsComponent {
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
}
