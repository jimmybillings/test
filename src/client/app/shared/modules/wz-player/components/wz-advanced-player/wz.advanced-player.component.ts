import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { PlayerStateService } from '../../services/player-state.service';
import { WzPlayerComponent } from '../wz-player/wz.player.component';
import { SubclipMarkers, SubclipMarkerFrames } from '../../../../interfaces/asset.interface';
import { PlayerState, PlayerStateChanges, PlayerRequest, PlayerRequestType } from '../../interfaces/player.interface';
import { Subscription } from 'rxjs/Rx';
import { Frame } from 'wazee-frame-formatter';

@Component({
  moduleId: module.id,
  selector: 'wz-advanced-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlayerStateService],
  templateUrl: './wz.advanced-player.html'
})

export class WzAdvancedPlayerComponent implements OnInit, OnDestroy {
  @Input() window: any;
  @Input() displayAllControls: boolean = true;
  @Input() markersSaveButtonEnabled: boolean = true;
  @Output() onSubclip = new EventEmitter();
  @Output() markerChange: EventEmitter<SubclipMarkers> = new EventEmitter<SubclipMarkers>();
  @Output() markerFramesInitialize: EventEmitter<SubclipMarkerFrames> = new EventEmitter<SubclipMarkerFrames>();
  @Output() markerFrameChange: EventEmitter<SubclipMarkerFrames> = new EventEmitter<SubclipMarkerFrames>();
  @Output() markerSaveButtonClick: EventEmitter<null> = new EventEmitter<null>();
  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;

  private playerStateSubscription: Subscription;
  private currentAsset: any = null;
  private currentState: PlayerState = null;

  @Input()
  public set asset(newAsset: any) {
    this.playerStateService.reset();
    this.currentState = null;
    this.currentAsset = newAsset;
  }

  public get asset(): any {
    return this.currentAsset;
  }

  public assetIsVideo(): boolean {
    return this.currentAsset.resourceClass !== 'Image';
  }

  constructor(private playerStateService: PlayerStateService) { }

  public ngOnInit(): void {
    this.playerStateSubscription = this.playerStateService.state.subscribe(this.onStateChange.bind(this));
  }

  public ngOnDestroy(): void {
    this.playerStateSubscription.unsubscribe();
  }

  public onStateChangeRequest(changes: PlayerStateChanges): void {
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
        this.markerSaveButtonClick.emit();
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

  private onStateChange(newState: PlayerState) {
    if (!this.currentState) {
      this.markerFramesInitialize.emit({ in: newState.inMarkerFrame, out: newState.outMarkerFrame });
    } else if (this.markersChangedIn(newState)) {
      this.markerChange.emit({
        in: newState.inMarkerFrame ? newState.inMarkerFrame.frameNumber : undefined,
        out: newState.outMarkerFrame ? newState.outMarkerFrame.frameNumber : undefined
      });

      this.markerFrameChange.emit({ in: newState.inMarkerFrame, out: newState.outMarkerFrame });
    }

    this.currentState = newState;
  }

  private markersChangedIn(newState: PlayerState): boolean {
    if (!this.currentState) return false;

    return !this.areEqual(newState.inMarkerFrame, this.currentState.inMarkerFrame) ||
      !this.areEqual(newState.outMarkerFrame, this.currentState.outMarkerFrame)
  }

  private areEqual(frame1: Frame, frame2: Frame): boolean {
    if (frame1 && !frame2) return false;
    if (!frame1 && frame2) return false;
    if (!frame1 && !frame2) return true;

    return frame1.frameNumber === frame2.frameNumber;
  }
}
