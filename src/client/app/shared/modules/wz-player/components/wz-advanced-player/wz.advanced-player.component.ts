import { Component, ChangeDetectionStrategy, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { PlayerStateService } from '../../services/player-state.service';
import { WzPlayerComponent } from '../wz-player/wz.player.component';
import { SubclipMarkers } from '../../../../interfaces/asset.interface';
import { PlayerState, PlayerStateChanges, PlayerRequest, PlayerRequestType } from '../../interfaces/player.interface';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'wz-advanced-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlayerStateService],
  templateUrl: './wz.advanced-player.html'
})

export class WzAdvancedPlayerComponent {
  @Input() dialog: any;
  @Input() window: any;
  @Output() onSubclip = new EventEmitter();
  @Output() onUpdateSubclipData = new EventEmitter();
  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;

  public displayContext: string = 'assetDetails';
  public playerStateSubscription: Subscription;
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

  constructor(public playerStateService: PlayerStateService) {
    this.playerStateSubscription = playerStateService.state.subscribe((data) => {
      if (data.inMarkerFrame && data.outMarkerFrame) {
        this.onUpdateSubclipData.emit({ in: data.inMarkerFrame, out: data.outMarkerFrame });
        // this.playerStateSubscription.unsubscribe();
      }
    });
  }

  public onStateUpdate(changes: PlayerStateChanges): void {
    this.playerStateService.updateWith(changes);
  }

  public handle(request: PlayerRequest): void {
    const state: PlayerState = this.playerStateService.snapshot;

    switch (request.type) {
      case PlayerRequestType.ClearMarkers:
        this.player.clearMarkers();
        break;
      case PlayerRequestType.SaveMarkers:
        this.onSubclip.emit({ in: state.inMarkerFrame.frameNumber, out: state.outMarkerFrame.frameNumber });
        break;
      case PlayerRequestType.SeekToFrame:
        this.player.seekTo(request.payload.frame.asSeconds());
        break;
      case PlayerRequestType.SeekToInMarker:
        this.player.seekToInMarker();
        break;
      case PlayerRequestType.SeekToOutMarker:
        this.player.seekToOutMarker();
        break;
      case PlayerRequestType.SetInMarker:
        this.player.setInMarkerToCurrentTime();
        break;
      case PlayerRequestType.SetOutMarker:
        this.player.setOutMarkerToCurrentTime();
        break;
      case PlayerRequestType.TogglePlayback:
        this.player.togglePlayback();
        break;
      case PlayerRequestType.ToggleMarkersPlayback:
        this.player.toggleMarkersPlayback();
        break;
    }
  }
}
