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
  @Output() onSubclip = new EventEmitter();
  @Output() onUpdateSubclipData = new EventEmitter();
  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;
  public playerStateSubscription: Subscription;
  private currentAsset: any = null;

  @Input()
  public set asset(newAsset: any) {
    this.playerStateService.reset();
    this.currentAsset = newAsset;

    if (this.assetIsVideo()) this.updateStateFrameRate();
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

  private updateStateFrameRate(): void {
    let frameRateMetadata: string = this.findMetadataValueFor('Format.FrameRate', this.currentAsset);

    if (frameRateMetadata === null) {
      const assetName: string = this.findMetadataValueFor('name', this.currentAsset) || 'asset';

      console.error(`Could not find 'Format.FrameRate' metadata for ${assetName} (id=${this.currentAsset.assetId}).` +
        ' Using arbitrary frameRate of 29.97fps, which could be completely wrong.');

      frameRateMetadata = '29.97';
    }

    this.playerStateService.updateWith({ framesPerSecond: parseFloat(frameRateMetadata) });
  }

  private findMetadataValueFor(metadataName: string, object: any): string {
    if (object !== Object(object)) return null;

    const keys = Object.keys(object);

    if (keys.length === 2 && keys.sort().join('|') === 'name|value' && object.name === metadataName) {
      return object.value;
    }

    for (var key of keys) {
      const value = this.findMetadataValueFor(metadataName, object[key]);
      if (value) return value;
    }

    return null;
  }
}
