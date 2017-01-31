import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

export type StepSize = '-5s' | '-1s' | '-1f' | '+1f' | '+1s' | '+5s';

@Component({
  moduleId: module.id,
  selector: 'step-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button [disabled]="!canStep" class="{{ direction }}" title="{{ title | translate }}" (click)="onClick()">
      <md-icon class="{{ iconClass }} material-icons">play_arrow</md-icon>
    </button>
  `
})

export class StepButtonComponent {
  @Input()
  public set size(size: StepSize) {
    const [sign, magnitude, unit] = size.split('');

    this.direction = sign === '-' ? 'reverse' : 'forward';
    this.vector = parseInt(magnitude);
    if (sign === '-') this.vector *= -1;
    this.unit = unit === 'f' ? 'frame' : 'second';
    this.title = `ASSET.ADV_PLAYER.SKIP_${magnitude}${unit.toUpperCase()}_${sign === '-' ? 'BACK' : 'FORWARD'}_BTN_TITLE`;
    this.iconClass = `${magnitude === '5' ? 'five' : 'one'}-${this.unit}`;
  }

  @Input()
  public set playerState(playerState: PlayerState) {
    this._playerState = playerState;

    let needToRecalculate: boolean = false;

    if (playerState.framesPerSecond !== this.framesPerSecond) {
      this.framesPerSecond = playerState.framesPerSecond;
      needToRecalculate = true;
    }

    if (this.direction === 'forward' && playerState.durationFrame) {
      const newFrameNumber: number = playerState.durationFrame.frameNumber;

      if (newFrameNumber !== this.durationFrameNumber) {
        this.durationFrameNumber = newFrameNumber;
        needToRecalculate = true;
      }
    }

    if (needToRecalculate) this.calculateBoundary();
  }

  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public direction: 'reverse' | 'forward';
  public title: string;
  public iconClass: string;

  private _playerState: PlayerState;
  private vector: number;
  private unit: 'frame' | 'second';
  private framesPerSecond: number;
  private durationFrameNumber: number;
  private boundaryFrameNumber: number;

  public get canStep(): boolean {
    if (!this._playerState.currentFrame) return false;

    return this.direction === 'reverse'
      ? this._playerState.currentFrame.frameNumber > this.boundaryFrameNumber
      : this._playerState.currentFrame.frameNumber < this.boundaryFrameNumber;
  }

  public onClick(): void {
    this.request.emit({ type: PlayerRequestType.SeekToFrame, payload: { frame: this.seekTarget } });
  }

  private calculateBoundary(): void {
    const magnitude: number = this.direction === 'reverse' ? -this.vector : this.vector;
    const frame: Frame = new Frame(this.framesPerSecond);

    if (this.unit === 'frame') {
      frame.setFromFrameNumber(magnitude);
    } else {
      frame.setFromSeconds(magnitude);
    }

    this.boundaryFrameNumber = this.direction === 'reverse'
      ? frame.frameNumber
      : this.durationFrameNumber - frame.frameNumber;
  }

  private get seekTarget(): Frame {
    const seekTarget: Frame = new Frame(this.framesPerSecond).setFromFrameNumber(this._playerState.currentFrame.frameNumber);

    if (this.unit === 'frame') {
      seekTarget.addFrames(this.vector);
    } else {
      seekTarget.setFromSeconds(seekTarget.asSeconds() + this.vector);
    }

    return seekTarget;
  }
}
