import { Component, ChangeDetectionStrategy, Input, Output, ElementRef, EventEmitter, NgZone } from '@angular/core';
declare var jwplayer: any;

import { WzPlayerStateService } from '../wz.player-state.service';
import { WzPlayerMode, WzPlayerStateChanges } from '../wz.player.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-player',
  template: ``,
  // styles: ['img { width:100%; height:100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WzPlayerComponent {
  @Input() mode: WzPlayerMode = 'basic';
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
  @Output() stateUpdate: EventEmitter<WzPlayerStateChanges> = new EventEmitter<WzPlayerStateChanges>();

  private currentAsset: any;
  private jwPlayer: any;

  constructor(private element: ElementRef, private zone: NgZone) { }

  public togglePlayback(): void {
    // Omitting the state argument means toggle playback.
    this.jwPlayer.play();
  }

  public seekTo(timeInSeconds: number): void {
    this.jwPlayer.seek(timeInSeconds);
  }

  public playRange(startPoint: number, endPoint: number): void {
    if (this.mode !== 'advanced') throw new TypeError('Must be in advanced mode to play subclip.');

    // TODO: What if we are playing here, and the user pauses in the middle?
    // We need to reset our state as if we had reached the out marker.

    // TODO: Prevent this call from being called again while we're in progress?

    this.jwPlayer
      .once('seeked', () => {
        // Temporarily replace standard 'time' event handler.
        this.jwPlayer
          .off('time')
          .on('time', (event: any) => {
            this.emitStateUpdateWith({ currentTime: event.position });

            if (event.position >= endPoint) {
              // Restore standard 'time' event handler.
              this.jwPlayer.pause().off('time');
              this.handleTimeEvents();
            }
          }).play();
      })
      .pause()
      .seek(startPoint);
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
      this.preventAutoplayAfterSeek();
    }
  }

  private handleDurationEvent(): void {
    this.jwPlayer.once('time', (event: any) => this.emitStateUpdateWith({ duration: event.duration }));
  }

  private handleTimeEvents(): void {
    this.jwPlayer.on('time', (event: any) => this.emitStateUpdateWith({ currentTime: event.position }));
  }

  private handlePlaybackStateEvents(): void {
    this.jwPlayer.on('play', () => this.emitStateUpdateWith({ playing: true }));
    this.jwPlayer.on('pause', () => this.emitStateUpdateWith({ playing: false }));
    this.jwPlayer.on('complete', () => this.emitStateUpdateWith({ playing: false }));
  }

  private emitStateUpdateWith(changes: WzPlayerStateChanges): void {
    // Run these in "the Angular zone" so that the change detector sees changes now, not on the next cycle.
    this.zone.run(() => this.stateUpdate.emit(changes));
  }

  private preventAutoplayAfterSeek(): void {
    // TODO: Temporarily suspend 'playing' state emissions during seek, so that the play button doesn't
    // flicker during the seek.

    // TODO: This doesn't seem to work when we're stopped at the end of video.

    this.jwPlayer.on('seek', () => {
      const wasPaused: boolean = this.jwPlayer.getState() === 'paused';

      this.jwPlayer.once('seeked', () => {
        if (wasPaused) this.jwPlayer.pause();
      });
    });
  }

  private setupImage() {
    var imgWrapper = document.createElement('div');
    imgWrapper.className = 'photo-container';
    var elem = document.createElement('img');
    elem.src = this.currentAsset.clipUrl;
    imgWrapper.appendChild(elem);
    this.element.nativeElement.appendChild(imgWrapper);
  }

  private reset() {
    if (this.jwPlayer) {
      this.jwPlayer.pause();

      if (this.mode === 'advanced') {
        this.emitStateUpdateWith({ duration: undefined, currentTime: 0 });
      }

      this.jwPlayer.remove();
      this.jwPlayer = null;
    }

    this.element.nativeElement.innerHTML = '';
  }
}
