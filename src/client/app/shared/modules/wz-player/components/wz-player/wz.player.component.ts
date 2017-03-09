import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  ElementRef,
  Renderer,
  EventEmitter,
  NgZone,
  OnDestroy
} from '@angular/core';

import { AssetInfo } from './assetInfo';
import { PlayerMode, PlaybackDirection, PlayerStateChanges } from '../../interfaces/player.interface';
declare var jwplayer: any;

type AssetType = 'unknown' | 'image' | 'video' | 'html5Video';
type MarkersPlaybackMode = 'off' | 'initializing' | 'on';

@Component({
  moduleId: module.id,
  selector: 'wz-player',
  template: ``,
  // styles: ['img { width:100%; height:100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WzPlayerComponent implements OnDestroy {
  @Input() mode: PlayerMode = 'basic';
  @Input() window: any;

  @Input()
  public set asset(newAsset: any) {
    this.reset();
    this.assetInfo.asset = newAsset;

    newAsset.resourceClass === 'Image' ? this.setupImage() : this.setupVideo();
  }

  public get asset(): any {
    return this.assetInfo.asset;
  }

  @Output() stateUpdate: EventEmitter<PlayerStateChanges> = new EventEmitter<PlayerStateChanges>();

  private currentAsset: any;
  private assetInfo: AssetInfo = new AssetInfo();
  private jwPlayer: any;
  private videoElement: any;
  private currentAssetType: AssetType = 'unknown';
  private markersPlaybackMode: MarkersPlaybackMode = 'off';
  private inMarker: number = undefined;
  private outMarker: number = undefined;
  private videoElementListenerRemovers: any;

  constructor(private element: ElementRef, private renderer: Renderer, private zone: NgZone) { }

  public ngOnDestroy(): void {
    this.reset();
  }

  public togglePlayback(): void {
    this.verifyCustomControlsSupport();

    this.setPlaybackRateTo(1);
    this.videoElement.paused ? this.videoElement.play() : this.videoElement.pause();
  }

  public playAtSpeed(speed: number, direction: PlaybackDirection = 'forward'): void {
    this.verifyCustomControlsSupport();
    if (direction === 'reverse') throw new Error('Reverse playback is not yet supported.');

    // this.setPlaybackRateTo((direction === 'reverse' ? -1 : 1) * speed);
    this.setPlaybackRateTo(speed);

    if (this.videoElement.paused) this.videoElement.play();
  }

  public seekTo(timeInSeconds: number): void {
    this.verifyCustomControlsSupport();

    this.videoElement.currentTime = timeInSeconds;
  }

  public seekToInMarker(): void {
    this.verifyCustomControlsSupport();
    if (!this.inMarker) throw new Error('Cannot seek to in marker because it is not set.');

    this.seekTo(this.inMarker);
  }

  public seekToOutMarker(): void {
    this.verifyCustomControlsSupport();
    if (!this.outMarker) throw new Error('Cannot seek to out marker because it is not set.');

    this.seekTo(this.outMarker);
  }

  public setInMarkerToCurrentTime(): void {
    this.verifyCustomControlsSupport();

    this.inMarker = this.videoElement.currentTime;

    if (this.outMarker && this.outMarker < this.inMarker) {
      this.outMarker = this.inMarker;
      this.emitStateUpdateWith({ inMarker: this.inMarker, outMarker: this.outMarker });
    } else {
      this.emitStateUpdateWith({ inMarker: this.inMarker });
    }
  }

  public setOutMarkerToCurrentTime(): void {
    this.verifyCustomControlsSupport();

    if (this.markersPlaybackMode === 'on') {
      // We have automatically just reached the out marker because we just moved it to currentTime.
      this.videoElement.pause();
      this.markersPlaybackMode = 'off';
      this.emitStateUpdateWith({ playingMarkers: false });
    }

    this.outMarker = this.videoElement.currentTime;

    if (this.inMarker && this.inMarker > this.outMarker) {
      this.inMarker = this.outMarker;
      this.emitStateUpdateWith({ inMarker: this.inMarker, outMarker: this.outMarker });
    } else {
      this.emitStateUpdateWith({ outMarker: this.outMarker });
    }
  }

  public clearMarkers(): void {
    this.verifyCustomControlsSupport();

    if (this.markersPlaybackMode === 'on') {
      // Clearing the markers immediately kills markers playback mode.
      this.markersPlaybackMode = 'off';
      this.emitStateUpdateWith({ playingMarkers: false });
    }

    this.inMarker = undefined;
    this.outMarker = undefined;

    this.emitStateUpdateWith({ inMarker: undefined, outMarker: undefined });
  }

  public toggleMarkersPlayback(): void {
    this.verifyCustomControlsSupport();

    if (this.markersPlaybackMode === 'on') {
      this.togglePlayback();
    } else if (this.markersPlaybackMode === 'off') {
      if (!this.inMarker || !this.outMarker) throw new Error('Cannot play between markers unless they are both set.');

      this.markersPlaybackMode = 'initializing';

      this.seekTo(this.inMarker);
      // ... execution continues in onSeeked().
      // From there, markers playback stops in onSeeking() or onTimeUpdate().
    }
  }

  public toggleMute(): void {
    this.verifyCustomControlsSupport();

    this.videoElement.muted = !this.videoElement.muted;
  }

  public setVolumeTo(newVolume: number): void {
    this.verifyCustomControlsSupport();

    if (this.videoElement.muted) {
      // We don't want to report any changes until we're all done.
      this.stopVideoEventListenerFor('volumechange');
      this.videoElement.muted = false;
      this.startVideoEventListenerFor('volumechange', this.onVolumeChange);
    }

    // newVolume is in the range 0 to 100.  The <video> element needs 0 to 1.
    this.videoElement.volume = newVolume / 100;
  }

  private verifyCustomControlsSupport(): void {
    if (this.mode === 'basic') throw new Error('Basic mode does not support custom controls.');
    if (this.currentAssetType !== 'html5Video') throw new Error('Current asset does not support custom controls.');
  }

  private setupVideo(): void {
    this.currentAssetType = 'video';
    this.jwPlayer = this.window.jwplayer(this.element.nativeElement);
    this.inMarker = this.assetInfo.inMarkerAsSeconds;
    this.outMarker = this.assetInfo.outMarkerAsSeconds;
    const autostartInAdvancedMode: boolean = !this.inMarker || !this.outMarker;

    this.jwPlayer.setup({
      image: this.assetInfo.asset.clipThumbnailUrl || null,
      file: this.assetInfo.asset.clipUrl,
      autostart: this.mode === 'basic' || autostartInAdvancedMode
    });

    if (this.mode === 'advanced') {
      this.jwPlayer.on('ready', () => {
        const jwPlayerProvider = this.jwPlayer.getProvider();

        if (jwPlayerProvider && jwPlayerProvider.name === 'html5') {
          this.currentAssetType = 'html5Video';
          this.jwPlayer.setControls(false);

          // Seems like the "correct" Angular-y way to do this would be to
          // find the <video> tag inside 'this.element.nativeElement'.  But
          // that doesn't seem to work, so we'll resort to this for now.
          // ASSUMPTION:  There is one <video> element in the document!
          this.videoElement = this.window.document.querySelector('video');

          this.startVideoEventListeners();

          this.emitStateUpdateWith({
            canSupportCustomControls: true,
            framesPerSecond: this.assetInfo.framesPerSecond,
            inMarker: this.inMarker,
            outMarker: this.outMarker,
            volume: this.currentVolume
          });

          if (!autostartInAdvancedMode) this.toggleMarkersPlayback();
        } else {
          if (!autostartInAdvancedMode) this.jwPlayer.play(true);
          this.emitStateUpdateWith({ canSupportCustomControls: false });
        }
      });
    }
  }

  private startVideoEventListeners(): void {
    this.startVideoEventListenerFor('durationchange', this.onDurationChange);
    this.startVideoEventListenerFor('pause', this.onPause);
    this.startVideoEventListenerFor('playing', this.onPlaying);
    this.startVideoEventListenerFor('ratechange', this.onRateChange);
    this.startVideoEventListenerFor('timeupdate', this.onTimeUpdate);
    this.startVideoEventListenerFor('seeked', this.onSeeked);
    this.startVideoEventListenerFor('seeking', this.onSeeking);
    this.startVideoEventListenerFor('volumechange', this.onVolumeChange);
  }

  private startVideoEventListenerFor(eventName: string, callback: Function): void {
    if (!this.videoElementListenerRemovers) this.videoElementListenerRemovers = {};

    // See http://stackoverflow.com/questions/35080387/dynamically-add-event-listener-in-angular-2
    this.videoElementListenerRemovers[eventName] = this.renderer.listen(this.videoElement, eventName, callback.bind(this));
  }

  private stopVideoEventListeners(): void {
    for (const eventName in this.videoElementListenerRemovers) {
      this.stopVideoEventListenerFor(eventName);
    }

    this.videoElementListenerRemovers = {};
  }

  private stopVideoEventListenerFor(eventName: string) {
    this.videoElementListenerRemovers[eventName]();
  }

  private onDurationChange(): void {
    this.emitStateUpdateWith({ duration: this.videoElement.duration });
  }

  private onPause(): void {
    this.emitStateUpdateWith({ playing: false });
  }

  private onPlaying(): void {
    this.emitStateUpdateWith({ playing: true });
  }

  private onRateChange(): void {
    this.emitStateUpdateWith({ playbackSpeed: this.videoElement.playbackRate });
  }

  private onSeeked(): void {
    if (this.markersPlaybackMode === 'initializing') {
      this.markersPlaybackMode = 'on';
      this.emitStateUpdateWith({ playingMarkers: true });
      if (this.videoElement.paused) this.videoElement.play();
    }
  }

  private onSeeking(): void {
    if (this.markersPlaybackMode === 'on') {
      // Any seek immediately kills range playback mode.
      this.markersPlaybackMode = 'off';
      this.emitStateUpdateWith({ playingMarkers: false });
    }
  }

  private onTimeUpdate(): void {
    const currentTime = this.videoElement.currentTime;

    this.emitStateUpdateWith({ currentTime: currentTime });

    if (this.markersPlaybackMode === 'on' && currentTime >= this.outMarker) {
      this.videoElement.pause();
      this.markersPlaybackMode = 'off';
      this.emitStateUpdateWith({ playingMarkers: false });

      if (currentTime > this.outMarker) this.seekTo(this.outMarker);
    }
  }

  private onVolumeChange(): void {
    this.emitStateUpdateWith({ volume: this.currentVolume });
  }

  private get currentVolume(): number {
    // The <video> element separately tracks values for "muted" (true/false) and "volume" (0 to 1.0).
    // To make things simpler for our event consumers, combine these into a single value from 0 to 100.
    return this.videoElement.muted ? 0 : Math.round(this.videoElement.volume * 100);
  }

  private emitStateUpdateWith(changes: PlayerStateChanges): void {
    // Run these in "the Angular zone" so that the change detector sees changes now, not on the next cycle.
    this.zone.run(() => this.stateUpdate.emit(changes));
  }

  private setupImage(): void {
    this.currentAssetType = 'image';
    let imgWrapper: HTMLElement = document.createElement('div');
    imgWrapper.className = 'photo-container';
    let elem: HTMLImageElement = document.createElement('img');
    elem.src = this.assetInfo.asset.clipUrl;
    imgWrapper.appendChild(elem);
    this.element.nativeElement.appendChild(imgWrapper);
  }

  private reset(): void {
    if (this.currentAssetType.match(/^video|html5Video$/)) {
      if (this.currentAssetType === 'html5Video') {
        this.stopVideoEventListeners();
      }

      if (this.mode === 'advanced') {
        this.emitStateUpdateWith({ duration: undefined, currentTime: 0 });
      }

      this.videoElement = null;
      this.jwPlayer.remove();
      this.jwPlayer = null;
      this.inMarker = undefined;
      this.outMarker = undefined;
    }

    this.currentAssetType = 'unknown';
    this.markersPlaybackMode = 'off';
    this.element.nativeElement.innerHTML = '';
  }

  private setPlaybackRateTo(newRate: number) {
    if (newRate !== this.videoElement.playbackRate) this.videoElement.playbackRate = newRate;
  }
}
