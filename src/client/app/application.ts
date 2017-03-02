import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { Http } from '@angular/http';

declare var portal: string;
declare var baseUrl: string;
declare var fetch: any;

export class Application {
  private baseUrl: string = baseUrl;
  private portal: string = portal;
  private endpoint: string = '/identities-api/v1/configuration/site?siteName=';

  constructor(private productionMode: boolean) { }

  public load() {
    (this.externalDataLoaded()) ? this.start() : this.loadExternalData();
  }

  private loadExternalData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.baseUrl + this.endpoint + this.portal);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        this.storeConfig(xhr.responseText);
        this.start();
      } else {
        alert('UI Config request failed to load, responsed with:' + xhr.status);
      }
    };
    xhr.send();
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
      Object.assign(response, { loaded: true })
    );
  }
}
