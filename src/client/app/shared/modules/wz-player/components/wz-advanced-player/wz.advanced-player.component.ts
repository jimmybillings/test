import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';

import { PlayerStateService } from '../../services/player-state.service';
import { WzPlayerComponent } from '../wz-player/wz.player.component';
import { PlayerState, PlayerStateChanges, PlayerRequest, PlayerRequestType } from '../../interfaces/player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-advanced-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlayerStateService],
  templateUrl: './wz.advanced-player.html'
})

export class WzAdvancedPlayerComponent {
  @Input() window: any;
  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;

  private currentAsset: any = null;

  @Input()
  public set asset(newAsset: any) {
    this.playerStateService.reset();
    this.currentAsset = newAsset;
  }

  public get asset(): any {
    return this.currentAsset;
  }

  public assetIsVideo(): boolean {
    return this.currentAsset.resourceClass !== 'Image';
  }

  constructor(public playerStateService: PlayerStateService) { }

  public onStateUpdate(changes: PlayerStateChanges): void {
    this.playerStateService.updateWith(changes);
  }

  public handle(request: PlayerRequest): void {
    const state: PlayerState = this.playerStateService.snapshot;

    switch (request.type) {
      case PlayerRequestType.ClearMarkers:
        this.playerStateService.updateWith({ inMarker: 'clear', outMarker: 'clear' });
        break;
      case PlayerRequestType.PlayWithinMarkers:
        this.player.playRange(state.inMarkerFrame.asSeconds(), state.outMarkerFrame.asSeconds());
        break;
      case PlayerRequestType.SeekToInMarker:
        this.player.seekTo(state.inMarkerFrame.asSeconds());
        break;
      case PlayerRequestType.SeekToOutMarker:
        this.player.seekTo(state.outMarkerFrame.asSeconds());
        break;
      case PlayerRequestType.SetInMarker:
        this.playerStateService.updateWith({ inMarker: 'currentFrame' });
        break;
      case PlayerRequestType.SetOutMarker:
        this.playerStateService.updateWith({ outMarker: 'currentFrame' });
        break;
      case PlayerRequestType.TogglePlayback:
        this.player.togglePlayback();
        break;
    }
  }
}
