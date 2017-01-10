import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { WzPlayerState, WzPlayerRequest, WzPlayerRequestType } from '../../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-playback-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    button { width: 70px; }
  `],
  template: `
    <button (click)="onClick()">{{ playerState.playing ? 'PAUSE' : 'PLAY' }}</button>
  `
})

export class WzPlaybackToggleButtonComponent {
  @Input() playerState: WzPlayerState;
  @Output() request: EventEmitter<WzPlayerRequest> = new EventEmitter<WzPlayerRequest>();

  public onClick(): void {
    this.request.emit({ type: WzPlayerRequestType.TogglePlayback });
  }
}
