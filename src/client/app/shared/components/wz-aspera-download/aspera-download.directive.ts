import { Directive, ChangeDetectionStrategy, HostListener, Input } from '@angular/core';
import { Order } from '../../../shared/interfaces/cart.interface';
declare var AW4: any;

@Directive({
  selector: '[wzAsperaDownload]'
})

export class WzAsperaDownloadDirective {
  @Input() asperaSpec: string;
  @HostListener('click', ['$event']) onClick($event: any) {
    this.download();
  }

  public download() {
    this.initConnect(
      Math.floor((Math.random() * 10000) + 1),
      this.handleDownloadCallback,
      JSON.parse(this.asperaSpec)
    );
  }

  private initConnect(id: number, callback: Function, spec: any) {
    const CONNECT_INSTALLER = '//d3gcli72yxqn2z.cloudfront.net/connect/v4';
    const asperaWeb = new AW4.Connect({
      sdkLocation: CONNECT_INSTALLER,
      minVersion: '3.6.0',
      id: 'aspera_web_transfers-' + id
    });

    const asperaInstaller = new AW4.ConnectInstaller({ sdkLocation: CONNECT_INSTALLER });

    asperaWeb.addEventListener(AW4.Connect.EVENT.STATUS, (eventType: any, data: any) => {
      switch (data) {
        case AW4.Connect.STATUS.INITIALIZING:
          asperaInstaller.showLaunching();
          return;
        case AW4.Connect.STATUS.FAILED:
          asperaInstaller.showDownload();
          return;
        case AW4.Connect.STATUS.OUTDATED:
          asperaInstaller.showUpdate();
          return;
        case AW4.Connect.STATUS.RUNNING:
          asperaInstaller.connected();
          callback(spec, asperaWeb, id);
          return;
        default:
          return;
      }
    });
    asperaWeb.initSession('nodeConnect-' + id);
  }

  private handleDownloadCallback(spec: any, asperaWeb: any, random: number) {
    const transferSpec = spec.transfer_specs[0].transfer_spec;
    transferSpec['target_rate_kbps'] = 100000;
    //Add token authentication tag to JSON since is it not returned with transferSpec.
    transferSpec.authentication = 'token';
    console.log(transferSpec);
    asperaWeb.startTransfer(transferSpec, { 'allow_dialogs': 'yes' });
  }

}
