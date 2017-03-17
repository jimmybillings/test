import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlayerRequest, TogglePlaybackRequest, TOGGLE_PLAYBACK } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-playback-toggle-button',
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
  @Output() request: EventEmitter<TogglePlaybackRequest> = new EventEmitter<TogglePlaybackRequest>();

  public onClick(): void {
    this.request.emit({ type: TOGGLE_PLAYBACK });
  }
}
