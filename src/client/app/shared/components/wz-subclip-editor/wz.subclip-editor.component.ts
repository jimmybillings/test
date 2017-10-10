import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { SubclipMarkers } from '../../interfaces/subclip-markers';
import { EnhancedAsset } from '../../interfaces/enhanced-asset';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-editor',
  template: `
    <wz-advanced-player
      [window]="window"
      [asset]="enhancedAsset"
      [displayAllControls]="false"
      (markersInitialization)="onPlayerMarkerChange($event)"
      (markerChange)="onPlayerMarkerChange($event)">
    </wz-advanced-player>

    <section layout="row" layout-align="end">
      <button mat-button color="primary" (click)="onCancelButtonClick()">
        {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.CANCEL_BTN_LABEL' | translate }}
      </button>

      <button mat-button class="is-outlined" color="primary"
        *ngIf="!markersAreRemovable"
        [disabled]="!markersAreSavable"
        (click)="onSaveButtonClick()">
        {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.SAVE_BTN_LABEL' | translate }}
      </button>
      
      <button mat-button class="is-outlined" color="accent"
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
  @Input() enhancedAsset: EnhancedAsset;
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @Output() save: EventEmitter<SubclipMarkers> = new EventEmitter<SubclipMarkers>();

  private playerMarkers: SubclipMarkers = { in: undefined, out: undefined };

  public get markersAreRemovable(): boolean {
    return this.enhancedAsset.isSubclipped && !this.markersAreSavable;
  }

  public get markersAreSavable(): boolean {
    return !!this.playerMarkers.in && !!this.playerMarkers.out;
  }

  public onPlayerMarkerChange(newMarkers: SubclipMarkers): void {
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
    this.save.emit(this.playerMarkers);
  }
}
