import { Component, ChangeDetectionStrategy, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { PlayerStateService } from '../../services/player-state.service';
import { WzPlayerComponent } from '../wz-player/wz.player.component';
import { SubclipMarkers } from '../../../../interfaces/asset.interface';
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
  @Output() onSubclip = new EventEmitter();
  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;

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
      case PlayerRequestType.SaveMarkers:
        this.onSubclip.emit({ in: state.inMarkerFrame.frameNumber, out: state.outMarkerFrame.frameNumber });
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
