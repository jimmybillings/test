import {Component, ChangeDetectionStrategy, Input, OnChanges} from '@angular/core';
declare var PlayerApi: any, PlayerEnvironment: any;
declare var jwplayer:any;
/**
 * site header component - renders the header information
 */
@Component({
  moduleId: module.id,
  selector: 'player',
  template: `
   <div id="assetVideoPlayer" style="width:100%; height:100%">Loading player...</div>
   `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PlayerComponent implements OnChanges {
  @Input() clip: string;
  @Input() clipUrl: string;
  @Input() clipThumbnailUrl: string;
  
  public player: { load: any };

  ngOnChanges(changes:any) {
    console.trace();
    console.log("here ==============>");
    console.dir(changes);
    console.log("End dir");
    // this.player = new PlayerApi(document.querySelector('iframe#player'), { environment: PlayerEnvironment.PRODUCTION });
    // this.player.load(changes.clip.currentValue, 'tem-r5tHustu');
    
    jwplayer("assetVideoPlayer").setup({ 
    //"file": "https://s3-t3m-previewpriv-or-1.s3.amazonaws.com/370/225/47/37022547_001_lp.f4v?AWSAccessKeyId=AKIAJEMCZ6EAEHB5KSYA&Expires=1468451806&Signature=jKF2n0zEd0yNEmGP0j0CMnzkO%2Bw%3D", 
        image: changes.clipThumbnailUrl.currentValue,
   //"file":"rtmpe://cp111580.edgefcs.net/ondemand/mp4:/tem/warehouse/370/225/47/37022547_001_lp.f4v"
        file:changes.clipUrl.currentValue,
        logo: {
          file: "assets/img/logo/watermark.png",
          position:"top-right",
          link:"http://www.wazeedigital.com"
        }
  });
  }
}
