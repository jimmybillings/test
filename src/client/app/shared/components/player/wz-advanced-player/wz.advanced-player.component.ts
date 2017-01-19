import { Component, ChangeDetectionStrategy, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { WzPlayerStateService } from '../wz.player-state.service';
import { WzPlayerComponent } from '../wz-player/wz.player.component';
import { SubclipMarkers } from '../../../interfaces/asset.interface';
import { WzPlayerState, WzPlayerStateChanges, WzPlayerRequest, WzPlayerRequestType } from '../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-advanced-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WzPlayerStateService],
  templateUrl: './wz.advanced-player.html'
})

export class WzAdvancedPlayerComponent {
  @Input() asset: any;
  @Input() window: any;
  @Output() onSubclip = new EventEmitter();
  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;

  constructor(public playerStateService: WzPlayerStateService) { }

  public onStateUpdate(changes: WzPlayerStateChanges): void {
    this.playerStateService.updateWith(changes);
  }

  public subclip(params: SubclipMarkers): void {
    console.log(`APC subclip markers: ${params.in} - ${params.out}`);
    this.onSubclip.emit(params);
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
