import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { WzPlayerState, WzPlayerRequest, WzPlayerRequestType } from '../../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-playback-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button title="{{ playerState.playing ? 'Pause' : 'Play' }}" (click)="onClick()">
      <md-icon>{{ playerState.playing ? 'pause' : 'play_arrow' }}</md-icon>
    </button>
  `
})

export class WzPlaybackToggleButtonComponent {
  @Input() playerState: WzPlayerState;
  @Output() request: EventEmitter<WzPlayerRequest> = new EventEmitter<WzPlayerRequest>();

  public onClick(): void {
    this.request.emit({ type: WzPlayerRequestType.TogglePlayback });
  }
}
