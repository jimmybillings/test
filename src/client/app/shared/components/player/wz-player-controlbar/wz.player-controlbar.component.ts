import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { WzPlayerState, WzPlayerRequest } from '../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-player-controlbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wz.player-controlbar.html'
})

export class WzPlayerControlbarComponent {
  @Input() playerState: WzPlayerState;
  @Output() request: EventEmitter<WzPlayerRequest> = new EventEmitter<WzPlayerRequest>();

  public forward(request: WzPlayerRequest): void {
    this.request.emit(request);
  }
}
