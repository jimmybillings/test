import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-markers-save-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button
      [disabled]="!playerState.inMarkerFrame || !playerState.outMarkerFrame"
      title="{{ 'ASSET.ADV_PLAYER.SAVE_BTN_TITLE' | translate }}"
      (click)="onClick()">
      <md-icon>library_add</md-icon>
    </button>
  `
})

export class MarkersSaveButtonComponent {
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public onClick(): void {
    this.request.emit({ type: PlayerRequestType.SaveMarkers });
  }
}
