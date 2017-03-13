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
  @Input() window: any;
  @Input() displayAllControls: boolean = true;
  @Output() onSubclip = new EventEmitter();
  @Output() onUpdateSubclipData = new EventEmitter();
  @Output() markerChange: EventEmitter<SubclipMarkers> = new EventEmitter<SubclipMarkers>();
  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;

  public playerStateSubscription: Subscription;
  private currentAsset: any = null;
  private currentState: PlayerState = null;

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
    this.playerStateSubscription = playerStateService.state.subscribe(newState => {
      if (newState.inMarkerFrame && newState.outMarkerFrame) {
        this.onUpdateSubclipData.emit({ in: newState.inMarkerFrame, out: newState.outMarkerFrame });
        // this.playerStateSubscription.unsubscribe();
      }

      if (this.currentState && (newState.inMarkerFrame !== this.currentState.inMarkerFrame
        || newState.outMarkerFrame !== this.currentState.outMarkerFrame)) {
        this.markerChange.emit({
          in: newState.inMarkerFrame ? newState.inMarkerFrame.frameNumber : undefined,
          out: newState.outMarkerFrame ? newState.outMarkerFrame.frameNumber : undefined
        });
      }

      this.currentState = newState;
    });
  }

  public onStateUpdate(changes: PlayerStateChanges): void {
    this.playerStateService.updateWith(changes);
  }

  public handle(request: PlayerRequest): void {
    const state: PlayerState = this.playerStateService.snapshot;
    const payload: any = request.payload;

    switch (request.type) {
      case PlayerRequestType.ClearMarkers:
        this.player.clearMarkers();
        break;
      case PlayerRequestType.PlayAtSpeed:
        this.player.playAtSpeed(payload.speed, payload.direction);
        break;
      case PlayerRequestType.SaveMarkers:
        this.onSubclip.emit({ in: state.inMarkerFrame.frameNumber, out: state.outMarkerFrame.frameNumber });
        break;
      case PlayerRequestType.SeekToFrame:
        this.player.seekTo(payload.frame.asSeconds());
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
      case PlayerRequestType.SetVolume:
        this.player.setVolumeTo(payload.volume);
        break;
      case PlayerRequestType.ToggleMarkersPlayback:
        this.player.toggleMarkersPlayback();
        break;
      case PlayerRequestType.ToggleMute:
        this.player.toggleMute();
        break;
      case PlayerRequestType.TogglePlayback:
        this.player.togglePlayback();
        break;
    }
  }
}
