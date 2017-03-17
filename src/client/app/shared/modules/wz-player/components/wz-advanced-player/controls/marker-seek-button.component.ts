import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { PlayerState, PlayerRequest, MarkerType, SEEK_TO_IN_MARKER, SEEK_TO_OUT_MARKER }
  from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-marker-seek-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button
      [disabled]="!frame || alreadyAtMarker" 
      class="{{ class }}" 
      title="{{ title | translate }}" 
      (click)="onClick()">
        <md-icon>keyboard_tab</md-icon>
    </button>
  `
})

export class MarkerSeekButtonComponent {
  @Input() type: MarkerType;
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public get frame(): Frame {
    return this.type === 'in' ? this.playerState.inMarkerFrame : this.playerState.outMarkerFrame;
  }

  public get alreadyAtMarker(): boolean {
    return this.frame && this.playerState.currentFrame && this.frame.frameNumber === this.playerState.currentFrame.frameNumber;
  }

  public get class(): string {
    return `seek-${this.type}`;
  }

  public get title(): string {
    return this.type === 'in' ? 'ASSET.ADV_PLAYER.SEEK_IN_BTN_TITLE' : 'ASSET.ADV_PLAYER.SEEK_OUT_BTN_TITLE';
  }

  public onClick(): void {
    if (this.type === 'in') {
      this.request.emit({ type: SEEK_TO_IN_MARKER });
    } else {
      this.request.emit({ type: SEEK_TO_OUT_MARKER });
    }
  }
}
