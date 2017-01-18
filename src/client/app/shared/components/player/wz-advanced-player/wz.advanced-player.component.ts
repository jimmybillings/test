import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';

import { WzPlayerStateService } from '../wz.player-state.service';
import { WzPlayerComponent } from '../wz-player/wz.player.component';
import { WzPlayerState, WzPlayerStateChanges, WzPlayerRequest, WzPlayerRequestType } from '../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-advanced-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WzPlayerStateService],
  templateUrl: './wz.advanced-player.html'
})

export class WzAdvancedPlayerComponent {
  @Input() window: any;
  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;

  @Input()
  public set asset(newAsset: any) {
    this.playerStateService.reset();
    this.currentAsset = newAsset;
  }

  public get asset(): any {
    return this.currentAsset;
  }

  private currentAsset: any = null;

  constructor(public playerStateService: WzPlayerStateService) { }

  public onStateUpdate(changes: WzPlayerStateChanges): void {
    this.playerStateService.updateWith(changes);
  }

  public handle(request: WzPlayerRequest): void {
    const state: WzPlayerState = this.playerStateService.snapshot;

    switch (request.type) {
      case WzPlayerRequestType.ClearMarkers:
        this.playerStateService.updateWith({ inMarker: 'clear', outMarker: 'clear' });
        break;
      case WzPlayerRequestType.PlayWithinMarkers:
        this.player.playRange(state.inMarkerFrame.asSeconds(), state.outMarkerFrame.asSeconds());
        break;
      case WzPlayerRequestType.SeekToInMarker:
        this.player.seekTo(state.inMarkerFrame.asSeconds());
        break;
      case WzPlayerRequestType.SeekToOutMarker:
        this.player.seekTo(state.outMarkerFrame.asSeconds());
        break;
      case WzPlayerRequestType.SetInMarker:
        this.playerStateService.updateWith({ inMarker: 'currentFrame' });
        break;
      case WzPlayerRequestType.SetOutMarker:
        this.playerStateService.updateWith({ outMarker: 'currentFrame' });
        break;
      case WzPlayerRequestType.TogglePlayback:
        this.player.togglePlayback();
        break;
    }
  }
}
