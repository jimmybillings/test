import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { MarkerType, PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'marker-seek-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button [disabled]="!frame" class="{{ class }}" title="{{ title | translate }}" (click)="onClick()">
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

  public get class(): string {
    return `seek-${this.type}`;
  }

  public get title(): string {
    return this.type === 'in' ? 'ASSET.ADV_PLAYER.SEEK_IN_BTN_TITLE' : 'ASSET.ADV_PLAYER.SEEK_OUT_BTN_TITLE';
  }

  public onClick(): void {
    this.request.emit({ type: this.type === 'in' ? PlayerRequestType.SeekToInMarker : PlayerRequestType.SeekToOutMarker });
  }
}
