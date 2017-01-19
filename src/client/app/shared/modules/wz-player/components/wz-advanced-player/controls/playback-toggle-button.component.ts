import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'playback-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button 
      title="{{ (playerState.playing ? 
        'ASSET.ADV_PLAYER.PAUSE_BTN_TITLE' : 'ASSET.ADV_PLAYER.PLAY_BTN_TITLE') | translate }}" 
      (click)="onClick()">
      <md-icon>{{ playerState.playing ? 'pause' : 'play_arrow' }}</md-icon>
    </button>
  `
})

export class PlaybackToggleButtonComponent {
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public onClick(): void {
    this.request.emit({ type: PlayerRequestType.TogglePlayback });
  }
}
