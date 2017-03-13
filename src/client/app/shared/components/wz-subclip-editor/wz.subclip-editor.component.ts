import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { SubclipMarkers } from '../../interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-editor',
  template: `
    <wz-advanced-player
      [window]="window"
      [asset]="asset"
      [displayAllControls]="false"
      (markerChange)="onPlayerMarkerChange($event)">
    </wz-advanced-player>

    <section layout="row" layout-align="end">
      <button md-button color="primary" (click)="dialog.close()">
        {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.CANCEL_BTN_LABEL' | translate }}
      </button>

      <button md-button class="is-outlined" color="primary"
        *ngIf="!markersAreRemovable"
        [disabled]="!markersAreSavable"
        (click)="onSaveButtonClick()">
        {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.SAVE_BTN_LABEL' | translate }}
      </button>
      
      <button md-button class="is-outlined" color="accent"
        *ngIf="markersAreRemovable"
        (click)="onRemoveButtonClick()">
        {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.REMOVE_BTN_LABEL' | translate }}
      </button>
    </section>
  `
})

export class WzSubclipEditorComponent {
  @Input() window: any;
  @Input() asset: any;
  @Input() dialog: any;
  @Output() save: EventEmitter<SubclipMarkers> = new EventEmitter<SubclipMarkers>();

  private playerMarkers: SubclipMarkers;

  public get markersAreRemovable(): boolean {
    return this.asset.timeStart && !this.markersAreSavable;
  }

  public get markersAreSavable(): boolean {
    return this.playerMarkers && !!this.playerMarkers.in && !!this.playerMarkers.out;
  }

  public onPlayerMarkerChange(newMarkers: SubclipMarkers): void {
    this.playerMarkers = newMarkers;
  }

  public onSaveButtonClick(): void {
    this.save.emit(this.playerMarkers);
  }

  public onRemoveButtonClick(): void {
    this.save.emit(this.playerMarkers);
  }
}
