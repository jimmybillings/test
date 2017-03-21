import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { SubclipMarkers, SubclipMarkerFrames } from '../../interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-editor',
  template: `
    <wz-advanced-player
      [window]="window"
      [asset]="asset"
      [displayAllControls]="false"
      (markersInitialization)="onPlayerMarkerChange($event)"
      (markerChange)="onPlayerMarkerChange($event)">
    </wz-advanced-player>

    <section layout="row" layout-align="end">
      <button md-button color="primary" (click)="onCancelButtonClick()">
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzSubclipEditorComponent {
  @Input() window: any;
  @Input() asset: any;
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @Output() save: EventEmitter<SubclipMarkers> = new EventEmitter<SubclipMarkers>();

  private playerMarkers: SubclipMarkerFrames = { in: undefined, out: undefined };

  public get markersAreRemovable(): boolean {
    return !!this.asset.timeStart && !this.markersAreSavable;
  }

  public get markersAreSavable(): boolean {
    return !!this.playerMarkers.in && !!this.playerMarkers.out;
  }

  public onPlayerMarkerChange(newMarkers: SubclipMarkerFrames): void {
    this.playerMarkers = newMarkers;
  }

  public onCancelButtonClick(): void {
    this.cancel.emit();
  }

  public onSaveButtonClick(): void {
    this.emitSaveEvent();
  }

  public onRemoveButtonClick(): void {
    this.emitSaveEvent();
  }

  private emitSaveEvent(): void {
    this.save.emit(
      this.markersAreSavable
        ? { in: this.playerMarkers.in.frameNumber, out: this.playerMarkers.out.frameNumber }
        : { in: undefined, out: undefined }
    );
  }
}
