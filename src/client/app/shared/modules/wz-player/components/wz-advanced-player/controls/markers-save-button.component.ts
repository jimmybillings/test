import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlayerRequest, SaveMarkersRequest, SAVE_MARKERS } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-markers-save-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button
      [disabled]="!enabled || !playerState.inMarkerFrame || !playerState.outMarkerFrame"
      title="{{ 'ASSET.ADV_PLAYER.SAVE_BTN_TITLE' | translate }}"
      (click)="onClick()">
      <md-icon>library_add</md-icon>
    </button>
  `
})

export class MarkersSaveButtonComponent {
  @Input() playerState: PlayerState;
  @Input() enabled: boolean = true;
  @Output() request: EventEmitter<SaveMarkersRequest> = new EventEmitter<SaveMarkersRequest>();

  public onClick(): void {
    this.request.emit({ type: SAVE_MARKERS });
  }
}
