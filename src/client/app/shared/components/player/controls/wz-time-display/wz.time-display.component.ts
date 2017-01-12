import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { WzPlayerState } from '../../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-time-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span>{{ playerState.currentTime }} / {{ playerState.duration }}</span>
  `
})

export class WzTimeDisplayComponent {
  @Input() playerState: WzPlayerState;
}
