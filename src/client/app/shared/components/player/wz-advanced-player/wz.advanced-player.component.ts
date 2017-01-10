import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';

import { WzPlayerStateService } from '../wz.player-state.service';
import { WzPlayerState, WzPlayerStateChanges } from '../wz.player.interface';
import { WzPlayerComponent } from '../wz-player/wz.player.component';

@Component({
  moduleId: module.id,
  selector: 'wz-advanced-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WzPlayerStateService],
  templateUrl: './wz.advanced-player.html'
})

export class WzAdvancedPlayerComponent {
  @Input() asset: any;

  @ViewChild(WzPlayerComponent) player: WzPlayerComponent;

  constructor(public playerStateService: WzPlayerStateService) { }

  public onStateUpdate(changes: WzPlayerStateChanges): void {
    this.playerStateService.updateWith(changes);
  }

  public requestSetInMarker(): void {
    this.playerStateService.updateWith({ inMarker: 'currentTime' });
  }

  public requestSetOutMarker(): void {
    this.playerStateService.updateWith({ outMarker: 'currentTime' });
  }

  public requestClearMarkers(): void {
    this.playerStateService.updateWith({ inMarker: 'clear', outMarker: 'clear' });
  }

  public requestSeekToInMarker(): void {
    this.player.seekTo(this.playerStateService.snapshot.inMarker);
  }

  public requestSeekToOutMarker(): void {
    this.player.seekTo(this.playerStateService.snapshot.outMarker);
  }

  public requestPlayWithinMarkers(): void {
    const state: WzPlayerState = this.playerStateService.snapshot;
    this.player.playRange(state.inMarker, state.outMarker);
  }

  public requestPlaybackToggle(): void {
    this.player.togglePlayback();
  }
}
