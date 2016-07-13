import {Component, ChangeDetectionStrategy, Input, OnChanges} from '@angular/core';
declare var jwplayer:any;
/**
 * site header component - renders the header information
 */
@Component({
  moduleId: module.id,
  selector: 'wz-player',
  template: `
   <div id="assetVideoPlayer" style='width:100%; height:100%'>Loading player...</div>
   `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WzPlayerComponent implements OnChanges {
  @Input() clip: string;
  @Input() clipUrl: string;
  @Input() clipThumbnailUrl: string;
  public player:{ load: any };

  ngOnChanges(changes:any) {
    jwplayer('assetVideoPlayer').setup({
        image: changes.clipThumbnailUrl.currentValue,
        file:changes.clipUrl.currentValue,
        logo: {
          file: 'assets/img/logo/watermark.png',
          position:'top-right',
          link:'http://www.wazeedigital.com'
        }
  });
  }
}
