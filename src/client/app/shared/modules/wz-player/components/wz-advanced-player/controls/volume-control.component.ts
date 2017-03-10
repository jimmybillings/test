import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { PlayerState, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-volume-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button md-icon-button *ngIf="!active" title="{{ buttonTitle | translate }}" (mouseover)="onMouseOver()">
      <md-icon>{{ iconName }}</md-icon>
    </button>

    <div *ngIf="active" class="volume-control" (mouseleave)="onMouseLeave()">
      <md-slider vertical min="0" max="100" value="{{ playerState.volume }}" (change)="onSliderChange($event)"></md-slider>

      <button md-icon-button title="{{ buttonTitle | translate }}" (click)="onButtonClick()">
        <md-icon>{{ iconName }}</md-icon>
      </button>
    </div>
  `
})

export class VolumeControlComponent {
  @Input() playerState: PlayerState;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public active: boolean = false;
  public buttonTitle: string = 'ASSET.ADV_PLAYER.SOUND_BTN_TITLE';

  public get iconName(): string {
    const volume: number = this.playerState.volume;

    if (volume > 66) return 'volume_up';
    if (volume > 33) return 'volume_down';
    if (volume > 0) return 'volume_mute';
    return 'volume_off';
  }

  public onMouseOver(): void {
    this.active = true;
  }

  public onMouseLeave(): void {
    this.active = false;
  }

  public onSliderChange(event: any): void {
    this.request.emit({ type: PlayerRequestType.SetVolume, payload: { volume: event.value } });
  }

  public onButtonClick(): void {
    this.request.emit({ type: PlayerRequestType.ToggleMute });
  }
}
