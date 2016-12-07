import { Component, ChangeDetectionStrategy, Input, OnChanges, ElementRef } from '@angular/core';
declare var jwplayer: any;

@Component({
  moduleId: module.id,
  selector: 'wz-player',
  template: ``,
  // styles: ['img { width:100%; height:100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WzPlayerComponent implements OnChanges {
  @Input() asset: any;
  private player: any;

  constructor(private element: ElementRef) { }

  ngOnChanges(changes: any) {
    if (changes.asset) {
      this.reset();
      (this.asset.resourceClass === 'Image') ? this.setupImage() : this.setupVideo();
    }
  }

  private setupVideo() {
    this.playerInstance.setup({
      image: this.asset.clipThumbnailUrl ? this.asset.clipThumbnailUrl : null,
      file: this.asset.clipUrl,
      logo: {
        file: 'assets/img/logo/watermark.png',
        position: 'top-right',
        link: 'http://www.wazeedigital.com'
      }
    });
  }

  private setupImage() {
    var elem = document.createElement('img');
    elem.src = this.asset.clipUrl;
    this.element.nativeElement.appendChild(elem);
  }

  private get playerInstance(): any {
    this.player = this.player || jwplayer(this.element.nativeElement);
    return this.player;
  }

  private reset() {
    this.playerInstance.remove();
    this.element.nativeElement.innerHTML = '';
  }

}
