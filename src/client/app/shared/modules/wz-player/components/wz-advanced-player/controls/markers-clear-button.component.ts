import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'markers-clear-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button
      [disabled]="!playerState.inMarkerFrame && !playerState.outMarkerFrame"
      title="{{ 'ASSET.ADV_PLAYER.CLEAR_IN_OUT_BTN_TITLE' | translate }}"
      (click)="onClick()">
      <md-icon>cancel</md-icon>
    </button>
  `
})

export class MarkersClearButtonComponent {
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public onClick(): void {
    this.request.emit({ type: PlayerRequestType.ClearMarkers });
  }
}
