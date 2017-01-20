import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { MarkerType, PlayerRequest, PlayerRequestType } from '../../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'marker-set-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <button class="is-outlined set-marker" md-button title="{{ title | translate }}" (click)="onClick()">
    {{ type }}
  </button>
  `
})

export class MarkerSetButtonComponent {
  @Input() type: MarkerType;
  @Output() request: EventEmitter<PlayerRequest> = new EventEmitter<PlayerRequest>();

  public get title(): string {
    return this.type === 'in' ? 'ASSET.ADV_PLAYER.SET_IN_BTN_TITLE' : 'ASSET.ADV_PLAYER.SET_OUT_BTN_TITLE';
  }

  public onClick(): void {
    this.request.emit({ type: this.type === 'in' ? PlayerRequestType.SetInMarker : PlayerRequestType.SetOutMarker });
  }
}
