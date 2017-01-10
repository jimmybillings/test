import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { WzPlayerState } from '../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-player-controlbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wz.player-controlbar.html'
})

export class WzPlayerControlbarComponent {
  @Input() playerState: WzPlayerState;
  @Output() playbackToggleRequested: EventEmitter<null> = new EventEmitter<null>();

  public onPlaybackToggleRequested(): void {
    this.playbackToggleRequested.emit();
  }
}
