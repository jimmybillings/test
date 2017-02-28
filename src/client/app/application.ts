import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

declare var portal: string;
declare var baseUrl: string;
declare var fetch: any;

export class Application {
  private baseUrl: string = baseUrl;
  private portal: string = portal;
  private endpoint: string = '/api/identities/v1/configuration/site?siteName=';
  private headers: { [name: string]: any } = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  constructor(private productionMode: boolean) { }

  public load() {
    (this.externalDataLoaded()) ? this.start() : this.loadExternalData().then(() => this.start());
  }

  private loadExternalData() {
    return fetch(this.baseUrl + this.endpoint + this.portal, this.headers)
      .then((response: any) => response.json())
      .then(this.storeConfig);
  }

  private start() {
    if (this.productionMode) enableProdMode();
    platformBrowserDynamic().bootstrapModule(AppModule/*, options*/);
  }

  private externalDataLoaded() {
    const config = JSON.parse(localStorage.getItem('uiConfig'));
    return config && config.loaded;
  }

  private storeConfig(response: any) {
    localStorage.setItem('uiConfig',
      JSON.stringify(Object.assign(response, { loaded: true }))
    );
  }
}
