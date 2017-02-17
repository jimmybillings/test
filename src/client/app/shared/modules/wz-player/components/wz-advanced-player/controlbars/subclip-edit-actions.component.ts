import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'subclip-edit-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-button color="primary" (click)="dialog.close()">
      {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.CANCEL_BTN_LABEL' | translate }}
    </button>
    <button md-button class="is-outlined" color="primary"
      *ngIf="!showRemoveMarkers()"
      [disabled]="!playerState.inMarkerFrame || !playerState.outMarkerFrame"
      (click)="onSave()">
      {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.SAVE_BTN_LABEL' | translate }}
    </button>
    <button md-button class="is-outlined" color="accent"
      *ngIf="showRemoveMarkers()"
      (click)="onRemove()">
      {{ 'ASSET.SAVE_SUBCLIP.EDIT_ACTIONS.REMOVE_BTN_LABEL' | translate }}
    </button>
  `
})

export class SubclipEditActionsComponent {
  @Input() dialog: any;
  @Input() hasStoredMarkers: boolean;
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public hasStoredMarkersAndCleared: boolean;

  public showRemoveMarkers(): boolean {
    return this.hasStoredMarkers && !this.playerState.inMarkerFrame && !this.playerState.outMarkerFrame ? true : false;
  }

  public onSave(): void {
    this.request.emit({ type: PlayerRequestType.SaveMarkers });
  }
  public onRemove(): void {
    this.request.emit({ type: PlayerRequestType.SaveMarkersAsUndefined });
  }
}
