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

import { PlayerMode, PlayerStateChanges } from '../../interfaces/player.interface';
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
    this.currentAsset = newAsset;
    this.reset();
    (this.currentAsset.resourceClass === 'Image') ? this.setupImage() : this.setupVideo();
  }

  public get asset(): any {
    return this.currentAsset;
  }

  @Output() stateUpdate: EventEmitter<PlayerStateChanges> = new EventEmitter<PlayerStateChanges>();

  private currentAsset: any;
  private jwPlayer: any;
  private videoElement: any;
  private currentAssetType: AssetType = 'unknown';
  private markersPlaybackMode: MarkersPlaybackMode = 'off';
  private outMarker: number = 0;
  private videoElementListenerRemovers: any;

  constructor(private element: ElementRef, private renderer: Renderer, private zone: NgZone) { }

  public ngOnDestroy(): void {
    this.reset();
  }

  public togglePlayback(): void {
    this.verifyCustomControlsSupport();

    this.videoElement.paused ? this.videoElement.play() : this.videoElement.pause();
  }

  public seekTo(timeInSeconds: number): void {
    this.verifyCustomControlsSupport();

    this.videoElement.currentTime = timeInSeconds;
  }

  public toggleMarkersPlayback(inMarker: number, outMarker: number): void {
    this.verifyCustomControlsSupport();

    if (this.markersPlaybackMode === 'on') {
      this.togglePlayback();
    } else if (this.markersPlaybackMode === 'off') {
      this.markersPlaybackMode = 'initializing';
      this.outMarker = outMarker;

      this.seekTo(inMarker);
      // ... execution continues in onSeeked().
      // From there, markers playback stops in onSeeking() or onTimeUpdate().
    }
  }

  private verifyCustomControlsSupport(): void {
    if (this.mode === 'basic') throw new Error('Basic mode does not support custom controls.');
    if (this.currentAssetType !== 'html5Video') throw new Error('Current asset does not support custom controls.');
  }

  private setupVideo(): void {
    this.currentAssetType = 'video';
    this.jwPlayer = this.window.jwplayer(this.element.nativeElement);

    this.jwPlayer.setup({
      image: this.currentAsset.clipThumbnailUrl ? this.currentAsset.clipThumbnailUrl : null,
      file: this.currentAsset.clipUrl,
      logo: {
        file: 'assets/img/logo/watermark.png',
        position: 'top-right',
        link: 'http://www.wazeedigital.com'
      }
    });

    if (this.mode === 'advanced') {
      this.jwPlayer.on('ready', () => {
        const jwPlayerProvider = this.jwPlayer.getProvider();

        if (jwPlayerProvider && jwPlayerProvider.name === 'html5') {
          // Seems like the "correct" Angular-y way to do this would be to
          // find the <video> tag inside 'this.element.nativeElement'.  But
          // that doesn't seem to work, so we'll resort to this for now.
          // ASSUMPTION:  There is one <video> element in the document!
          this.videoElement = this.window.document.querySelector('video');

          this.startVideoEventListeners();

          this.currentAssetType = 'html5Video';
          this.emitStateUpdateWith({ canSupportCustomControls: true });
        } else {
          this.emitStateUpdateWith({ canSupportCustomControls: false });
        }
      });
    }
  }

  private startVideoEventListeners(): void {
    this.startVideoEventListenerFor('durationchange', this.onDurationChange);
    this.startVideoEventListenerFor('pause', this.onPause);
    this.startVideoEventListenerFor('playing', this.onPlaying);
    this.startVideoEventListenerFor('timeupdate', this.onTimeUpdate);
    this.startVideoEventListenerFor('seeked', this.onSeeked);
    this.startVideoEventListenerFor('seeking', this.onSeeking);
  }

  private startVideoEventListenerFor(eventName: string, callback: Function): void {
    if (!this.videoElementListenerRemovers) this.videoElementListenerRemovers = {};

    // See http://stackoverflow.com/questions/35080387/dynamically-add-event-listener-in-angular-2
    this.videoElementListenerRemovers[eventName] = this.renderer.listen(this.videoElement, eventName, callback.bind(this));
  }

  private stopVideoEventListeners(): void {
    for (const eventName in this.videoElementListenerRemovers) {
      this.videoElementListenerRemovers[eventName]();
    }

    this.videoElementListenerRemovers = {};
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

  private emitStateUpdateWith(changes: PlayerStateChanges): void {
    // Run these in "the Angular zone" so that the change detector sees changes now, not on the next cycle.
    this.zone.run(() => this.stateUpdate.emit(changes));
  }

  private setupImage(): void {
    this.currentAssetType = 'image';
    let imgWrapper: HTMLElement = document.createElement('div');
    imgWrapper.className = 'photo-container';
    let elem: HTMLImageElement = document.createElement('img');
    elem.src = this.currentAsset.clipUrl;
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
    }

    this.currentAssetType = 'unknown';
    this.markersPlaybackMode = 'off';
    this.element.nativeElement.innerHTML = '';
  }
}
