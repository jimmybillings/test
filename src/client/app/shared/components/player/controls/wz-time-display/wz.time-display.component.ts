import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { WzPlayerState } from '../../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-time-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span>{{ playerState.currentFrame | timecode }} / {{ playerState.durationFrame | timecode }}</span>
  `
})

export class WzTimeDisplayComponent {
  @Input() playerState: WzPlayerState;
}
