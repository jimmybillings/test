import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlaybackDirection, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'fast-playback-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button [disabled]="!canPlayFast()" title="{{ title | translate }}" (click)="onClick()">
      <md-icon>{{ iconName }}</md-icon>
    </button>
  `
})

export class FastPlaybackButtonComponent {
  @Input() playerState: PlayerState;
  @Input() direction: PlaybackDirection = 'forward';
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public get iconName(): string {
    return this.direction === 'reverse' ? 'fast_rewind' : 'fast_forward';
  }

  public get title(): string {
    return `ASSET.ADV_PLAYER.${this.iconName.toUpperCase()}_BTN_TITLE`;
  }

  public canPlayFast(): boolean {
    const currentSpeed = this.playerState.playbackSpeed;

    return (this.direction === 'reverse' && currentSpeed >= -1) || (this.direction === 'forward' && currentSpeed <= 1);
  }

  public onClick(): void {
    this.request.emit({ type: PlayerRequestType.PlayAtSpeed, payload: { speed: 4, direction: this.direction } });
  }
}
