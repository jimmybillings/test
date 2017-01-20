import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'subclip-controlbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subclip-controlbar.html'
})

export class SubclipControlbarComponent {
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();
  @Output() onSubclip = new EventEmitter();

  public setInMarker(): void {
    this.request.emit({ type: PlayerRequestType.SetInMarker });
  }

  public setOutMarker(): void {
    this.request.emit({ type: PlayerRequestType.SetOutMarker });
  }

  public clear(): void {
    this.request.emit({ type: PlayerRequestType.ClearMarkers });
  }

  public forward(request: PlayerRequest): void {
    this.request.emit(request);
  }

  // TODO: Move this into state class.
  // private get constrainedCurrentTime() {
  //   return Math.min(Math.max(0, this.playerState.currentFrame), this.playerState.duration);
  // }
}
