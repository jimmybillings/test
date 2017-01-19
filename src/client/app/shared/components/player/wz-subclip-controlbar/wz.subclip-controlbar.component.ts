import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { WzPlayerState, WzPlayerRequest, WzPlayerRequestType } from '../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-controlbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wz.subclip-controlbar.html'
})

export class WzSubclipControlbarComponent {
  @Input() playerState: WzPlayerState;
  @Output() request: EventEmitter<WzPlayerRequest> = new EventEmitter<WzPlayerRequest>();
  @Output() onSubclip = new EventEmitter();
  public setInMarker(): void {
    this.request.emit({ type: WzPlayerRequestType.SetInMarker });
  }

  public setOutMarker(): void {
    this.request.emit({ type: WzPlayerRequestType.SetOutMarker });
  }

  public seekToInMarker(): void {
    this.request.emit({ type: WzPlayerRequestType.SeekToInMarker });
  }

  public seekToOutMarker(): void {
    this.request.emit({ type: WzPlayerRequestType.SeekToOutMarker });
  }

  public playInToOut(): void {
    this.request.emit({ type: WzPlayerRequestType.PlayWithinMarkers });
  }

  public clear(): void {
    this.request.emit({ type: WzPlayerRequestType.ClearMarkers });
  }

  // TODO: Move this into state class.
  // private get constrainedCurrentTime() {
  //   return Math.min(Math.max(0, this.playerState.currentFrame), this.playerState.duration);
  // }
}
