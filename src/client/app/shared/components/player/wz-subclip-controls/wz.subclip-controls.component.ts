import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { WzPlayerState } from '../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-subclip-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wz.subclip-controls.html'
})

export class WzSubclipControlsComponent {
  @Input() playerState: WzPlayerState;

  @Output() setInMarkerRequested: EventEmitter<null> = new EventEmitter<null>();
  @Output() setOutMarkerRequested: EventEmitter<null> = new EventEmitter<null>();
  @Output() seekToInMarkerRequested: EventEmitter<null> = new EventEmitter<null>();
  @Output() seekToOutMarkerRequested: EventEmitter<null> = new EventEmitter<null>();
  @Output() playWithinMarkersRequested: EventEmitter<null> = new EventEmitter<null>();
  @Output() clearMarkersRequested: EventEmitter<null> = new EventEmitter<null>();

  public setInMarker(): void {
    this.setInMarkerRequested.emit();
  }

  public setOutMarker(): void {
    this.setOutMarkerRequested.emit();
  }

  public seekToInMarker(): void {
    this.seekToInMarkerRequested.emit();
  }

  public seekToOutMarker(): void {
    this.seekToOutMarkerRequested.emit();
  }

  public playInToOut(): void {
    this.playWithinMarkersRequested.emit();
  }

  public clear(): void {
    this.clearMarkersRequested.emit();
  }

  // TODO: Move this into state class.
  private get constrainedCurrentTime() {
    return Math.min(Math.max(0, this.playerState.currentTime), this.playerState.duration);
  }
}
