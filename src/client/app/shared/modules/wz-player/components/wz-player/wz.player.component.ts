import { Component, ChangeDetectionStrategy, Input, Output, ElementRef, EventEmitter, NgZone, OnDestroy } from '@angular/core';
declare var jwplayer: any;

import { PlayerMode, PlayerStateChanges } from '../../interfaces/player.interface';

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

  // This event is emitted only for this.mode === 'advanced'.
  @Output() stateUpdate: EventEmitter<PlayerStateChanges> = new EventEmitter<PlayerStateChanges>();

  private currentAsset: any;
  private jwPlayer: any;
  private markersPlaybackMode: 'off' | 'initializing' | 'on' = 'off';
  private outMarker: number = 0;

  constructor(private element: ElementRef, private zone: NgZone) { }

  public ngOnDestroy(): void {
    this.reset();
  }

  public togglePlayback(): void {
    // Omitting the state argument means toggle playback.
    this.jwPlayer.play();
  }

  public seekTo(timeInSeconds: number): void {
    this.jwPlayer.seek(timeInSeconds);
  }

  public toggleMarkersPlayback(inMarker: number, outMarker: number): void {
    if (this.mode !== 'advanced') throw new TypeError('Must be in advanced mode to play subclip.');

    if (this.markersPlaybackMode === 'on') {
      this.togglePlayback();
    } else if (this.markersPlaybackMode === 'off') {
      this.markersPlaybackMode = 'initializing';
      this.outMarker = outMarker;

      this.jwPlayer.seek(inMarker);
      // ... execution continues in the 'seek' handler in handleSeekEvents(),
      // and from there, execution stops based on conditions in the 'time' handler
      // in handleTimeEvents().
    }
  }

  private setupVideo() {
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
      this.handleDurationEvent();
      this.handleTimeEvents();
      this.handlePlaybackStateEvents();
      this.handleSeekEvents();
    }
  }

  private handleDurationEvent(): void {
    this.jwPlayer.once('time', (event: any) => this.emitStateUpdateWith({ duration: event.duration }));
  }

  private handleTimeEvents(): void {
    this.jwPlayer.on('time', (event: any) => {
      this.emitStateUpdateWith({ currentTime: event.position });

      if (this.markersPlaybackMode === 'on' && event.position >= this.outMarker) {
        this.jwPlayer.pause(true);
        this.markersPlaybackMode = 'off';
        this.emitStateUpdateWith({ playingMarkers: false });

        if (event.position > this.outMarker) {
          // We overshot.  Unfortunately, jwPlayer doesn't trigger 'time'
          // events very often, so this is likely to happen.  All we can
          // do is seek back to the endPoint and hope it's quick enough
          // to be somewhat unnoticeable.
          this.jwPlayer.seek(this.outMarker);
        }
      }
    });
  }

  private handlePlaybackStateEvents(): void {
    this.jwPlayer
      .on('play', () => this.emitStateUpdateWith({ playing: true }))
      .on('pause', () => this.emitStateUpdateWith({ playing: false }))
      .on('complete', () => this.emitStateUpdateWith({ playing: false }));
  }

  private ignorePlaybackStateEvents(): void {
    this.jwPlayer.off('play').off('pause').off('complete');
  }

  private handleSeekEvents(): void {
    // TODO: This doesn't seem to work when we're stopped at the end of video.

    this.jwPlayer.on('seek', () => {
      if (this.markersPlaybackMode === 'initializing') {
        // We want to play anyway, so just let autoplay after seek happen.
        this.jwPlayer.once('seeked', () => {
          this.markersPlaybackMode = 'on';
          this.emitStateUpdateWith({ playingMarkers: true });
        });

        return;
      }

      if (this.markersPlaybackMode === 'on') {
        // Any seek immediately kills range playback mode.
        this.markersPlaybackMode = 'off';
        this.emitStateUpdateWith({ playingMarkers: false });
      }

      // JW Player ALWAYS starts playing after a seek! They have no setting
      // to prevent this, so if we were paused, we must manually re-pause as
      // soon as the 'seeked' event is triggered.
      //
      if (this.jwPlayer.getState() === 'paused') {
        // Note that this workaround is less than ideal because the 'seeked' event
        // seems to be triggered AFTER playback begins (why??), so this sometimes
        // causes a 'play' event and a 'pause' event to be triggered in rapid
        // succession, which in turn causes a brief flicker of the play/pause
        // toggle button in the UI.
        //
        // This would seem to be a better workaround:
        //   this.jwPlayer.once('play', () => this.jwPlayer.pause(true));
        //
        // If that worked, we wouldn't need to ignore playback state events because
        // we would be able to stop playback before the 'play' event is triggered.
        // (Because it seems that they call the 'once' callbacks before the 'on'
        // callbacks?) But somehow this means that we never get a 'time' event with
        // the result of the seek.  So this workaround is not viable.
        //
        // I can only assume that they are relying on the continued
        // playback to trigger the 'time' event.  (In general, it appears that
        // JW Player has several code paths that are too tightly intertwined.)
        //
        this.ignorePlaybackStateEvents();

        this.jwPlayer.once('seeked', () => {
          this.jwPlayer
            .once('pause', () => this.handlePlaybackStateEvents())
            .pause(true);
        });
      }
    });
  }

  private emitStateUpdateWith(changes: PlayerStateChanges): void {
    // Run these in "the Angular zone" so that the change detector sees changes now, not on the next cycle.
    this.zone.run(() => this.stateUpdate.emit(changes));
  }

  private setupImage() {
    let imgWrapper: HTMLElement = document.createElement('div');
    imgWrapper.className = 'photo-container';
    let elem: HTMLImageElement = document.createElement('img');
    elem.src = this.currentAsset.clipUrl;
    imgWrapper.appendChild(elem);
    this.element.nativeElement.appendChild(imgWrapper);
  }

  private reset() {
    if (this.jwPlayer) {
      this.jwPlayer.pause(true);

      if (this.mode === 'advanced') {
        this.emitStateUpdateWith({ duration: undefined, currentTime: 0 });
      }

      this.jwPlayer.remove();
      this.jwPlayer = null;
    }

    this.markersPlaybackMode = 'off';
    this.element.nativeElement.innerHTML = '';
  }
}
