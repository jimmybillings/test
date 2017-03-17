import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlayerRequest, ToggleMarkersPlaybackRequest, TOGGLE_MARKERS_PLAYBACK }
  from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-markers-playback-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button
      [disabled]="!playerState.inMarkerFrame || !playerState.outMarkerFrame"
      title="{{ 'ASSET.ADV_PLAYER.PLAY_IN_OUT_BTN_TITLE' | translate }}"
      (click)="onClick()">
      <md-icon>{{ playerState.playingMarkers && playerState.playing ? 'pause_circle_filled' : 'play_circle_filled' }}</md-icon>
    </button>
  `
})

export class MarkersPlaybackButtonComponent {
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<ToggleMarkersPlaybackRequest> = new EventEmitter<ToggleMarkersPlaybackRequest>();

  public onClick(): void {
    this.request.emit({ type: TOGGLE_MARKERS_PLAYBACK });
  }
}
