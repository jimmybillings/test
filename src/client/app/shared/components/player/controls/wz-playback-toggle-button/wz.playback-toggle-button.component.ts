import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { WzPlayerState } from '../../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-playback-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    button { width: 70px; }
  `],
  template: `
    <button>{{ playerState.playing ? 'PAUSE' : 'PLAY' }}</button>
  `
})

export class WzPlaybackToggleButtonComponent {
  @Input() playerState: WzPlayerState;
}
