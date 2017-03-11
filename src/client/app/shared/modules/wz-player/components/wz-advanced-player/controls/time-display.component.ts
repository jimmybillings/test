import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { PlayerState } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-time-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="timecode">{{ playerState.currentFrame | timecode }}</span>
    <span class="timecode divider">/</span>
    <span class="timecode duration">{{ playerState.durationFrame | timecode }}</span>
  `
})

export class TimeDisplayComponent {
  @Input() playerState: PlayerState;
}
