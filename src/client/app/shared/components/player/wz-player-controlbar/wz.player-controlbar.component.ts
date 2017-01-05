import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-player-controlbar',
  templateUrl: './wz.player-controlbar.html'
})

export class WzPlayerControlbarComponent {
  @Input() playing: boolean;
  @Output() playbackToggleRequested: EventEmitter<null> = new EventEmitter<null>();

  public onPlaybackToggleRequested(): void {
    this.playbackToggleRequested.emit();
  }
}
