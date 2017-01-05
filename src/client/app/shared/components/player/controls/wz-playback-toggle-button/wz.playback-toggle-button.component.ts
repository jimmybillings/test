import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-playback-toggle-button',
  styles: [`
    button { width: 70px; }
  `],
  template: `
    <button>{{ playing ? 'PAUSE' : 'PLAY' }}</button>
  `
})

export class WzPlaybackToggleButtonComponent {
  @Input() playing: boolean;
}
