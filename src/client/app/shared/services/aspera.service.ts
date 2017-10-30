import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { Api, ApiOptions } from '../interfaces/api.interface';
import { ApiService } from '../services/api.service';
import { AppStore } from '../../app.store';

declare var AW4: any;

@Injectable()
export class AsperaService {
  constructor(private api: ApiService, private store: AppStore) { }

  public initConnect(asperaSpec: string) {
    console.log(asperaSpec);
    const id = Math.floor((Math.random() * 10000) + 1);
    const CONNECT_INSTALLER = '//d3gcli72yxqn2z.cloudfront.net/connect/v4';
    const asperaWeb = new AW4.Connect({
      sdkLocation: CONNECT_INSTALLER,
      minVersion: '3.6.0',
      id: 'aspera_web_transfers-' + id
    });

    const asperaInstaller = new AW4.ConnectInstaller({
      sdkLocation: CONNECT_INSTALLER
    });

    asperaWeb.addEventListener(
      AW4.Connect.EVENT.STATUS,
      (eventType: any, data: any) => {
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
            this.handleDownload(JSON.parse(asperaSpec), asperaWeb, id);
            return;
          default:
            return;
        }
      });

    asperaWeb.initSession('nodeConnect-' + id);
  }

  public getAsperaSpec(assetId: number, renditionType: string): Observable<any> {
    return this.api.get(
      Api.Assets,
      `renditionType/asperaSpec/${assetId}`,
      { parameters: { type: renditionType } }
    );
  }

  private handleDownload(spec: any, asperaWeb: any, random: number) {
    const transferSpec = spec.transfer_specs[0].transfer_spec;
    transferSpec['target_rate_kbps'] = 100000;
    transferSpec.authentication = 'token';
    asperaWeb.startTransfer(transferSpec, { 'allow_dialogs': 'yes' });
  }
}
