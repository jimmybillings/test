import {Component, ChangeDetectionStrategy, Input, OnChanges} from '@angular/core';
declare var jwplayer: any;
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
  @Input() resourceClass:string;
  public player: { load: any };

  ngOnChanges(changes: any) {
      console.dir(changes);
    if (changes.clipUrl) {
      if(changes.resourceClass && changes.resourceClass.currentValue !== 'Image') {
          jwplayer('assetVideoPlayer').setup({
            image: changes.clipThumbnail ? changes.clipThumbnailUrl.currentValue: null,
            file: changes.clipUrl.currentValue,
            logo: {
              file: 'assets/img/logo/watermark.png',
              position: 'top-right',
              link: 'http://www.wazeedigital.com'
            }
          });
        }else {
             var elem = document.createElement('img');
             elem.src = changes.clipUrl.currentValue;
             elem.style.height='100%';
             elem.style.width='100%';
             document.getElementById('assetVideoPlayer').innerHTML='';
             document.getElementById('assetVideoPlayer').appendChild(elem);
        }

      }
    }
  }
