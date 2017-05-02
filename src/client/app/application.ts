import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app.module';
import { Http } from '@angular/http';

declare var portal: string;
declare var baseUrl: string;
declare var fetch: any;
portal = (localStorage.getItem('currentSite')) ? localStorage.getItem('currentSite') : portal;
export class Application {
  private baseUrl: string = baseUrl;
  private portal: string = portal;
  private endpoint: string = 'identities-api/v1/configuration/site?siteName=';

  constructor(private productionMode: boolean, private aot: any = false) { }

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
        if (localStorage.getItem('currentSite')) {
          alert('This site has no configs in this environment, going to reset to Commerce.');
          localStorage.clear();
          location.reload();
        } else {
          alert('UI Config request failed to load, responded with:' + xhr.status);
        }
      }
    };
    xhr.send();
  }

  private start() {
    if (this.productionMode) enableProdMode();
    if (this.aot) {
      platformBrowser().bootstrapModuleFactory(this.aot as any);
    } else {
      platformBrowserDynamic().bootstrapModule(AppModule/*, options*/);
    }
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
