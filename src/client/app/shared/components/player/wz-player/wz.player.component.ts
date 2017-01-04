import { Component, ChangeDetectionStrategy, Input, Output, ElementRef, EventEmitter } from '@angular/core';
declare var jwplayer: any;

import { SubclipMarkers } from '../../../interfaces/asset.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-player',
  template: ``,
  // styles: ['img { width:100%; height:100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WzPlayerComponent {
  @Input() mode: 'playback' | 'edit' = 'playback';

  @Input()
  public set asset(newAsset: any) {
    this.currentAsset = newAsset;
    this.reset();
    (this.currentAsset.resourceClass === 'Image') ? this.setupImage() : this.setupVideo();
  }

  public get asset(): any {
    return this.currentAsset;
  }

  // These events are emitted only for this.mode === 'edit'.
  @Output() timeUpdate: EventEmitter<number> = new EventEmitter<number>();
  @Output() durationUpdate: EventEmitter<number> = new EventEmitter<number>();

  private currentAsset: any;
  private jwPlayer: any; // Don't access this directly.  Use this.player getter instead.
  private currentlyPlaying: boolean = false;

  constructor(private element: ElementRef) { }

  public seekTo(timeInSeconds: number): void {
    this.player.seek(timeInSeconds);
  }

  public playSubclip(markers: SubclipMarkers): void {
    if (this.mode !== 'edit') throw new TypeError('Must be in edit mode to play subclip.');

    this.player
      .pause()
      .seek(markers.in)
      .once('seeked', () => {
        // temporarily replace 'time' event handler
        this.player
          .off('time')
          .on('time', (event: any) => {
            this.timeUpdate.emit(event.position);

            if (event.position >= markers.out) {
              this.player.pause().off('time');
              this.handleTimeEvents();
            }
          }).play();
      });
  }

  private setupVideo() {
    this.player.setup({
      image: this.currentAsset.clipThumbnailUrl ? this.currentAsset.clipThumbnailUrl : null,
      file: this.currentAsset.clipUrl,
      logo: {
        file: 'assets/img/logo/watermark.png',
        position: 'top-right',
        link: 'http://www.wazeedigital.com'
      }
    });

    if (this.mode === 'edit') {
      this.currentlyPlaying = true; // Because we are autoplaying on load.

      this.handleDurationEvent();
      this.handleTimeEvents();
      this.handleStateEvents();
      this.preventAutoplayAfterSeek();
    }
  }

  private handleDurationEvent(): void {
    this.player.once('time', (event: any) => this.durationUpdate.emit(event.duration));
  }

  private handleTimeEvents(): void {
    this.player.on('time', (event: any) => this.timeUpdate.emit(event.position));
  }

  private handleStateEvents(): void {
    this.player.on('play', () => this.currentlyPlaying = true);
    this.player.on('pause', () => this.currentlyPlaying = false);
  }

  private preventAutoplayAfterSeek(): void {
    this.player.on('seek', () => {
      const wasPlaying: boolean = this.currentlyPlaying;

      this.player.once('seeked', () => {
        if (!wasPlaying) this.player.pause();
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

  private get player(): any {
    this.jwPlayer = this.jwPlayer || jwplayer(this.element.nativeElement);
    return this.jwPlayer;
  }

  private reset() {
    this.player.pause();

    if (this.mode === 'edit') {
      this.durationUpdate.emit(undefined);
      this.timeUpdate.emit(0);
    }

    this.player.remove();
    this.jwPlayer = null;
    this.element.nativeElement.innerHTML = '';
  }
}
