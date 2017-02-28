require('hammerjs');
declare var portal: string;
declare var baseUrl: string;
declare var fetch: any;
/**
 * Bootstraps the application and makes the ROUTER_PROVIDERS and the APP_BASE_HREF available to it.
 * @see https://angular.io/docs/ts/latest/api/platform-browser-dynamic/index/bootstrap-function.html
 */
import { enableProdMode } from '@angular/core';
// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// Load i18n providers
// import { TranslationProviders } from './i18n.providers';

// The app module
import { AppModule } from './app.module';

if (String('<%= BUILD_TYPE %>') === 'prod') { enableProdMode(); }

// Compile and launch the module with i18n providers
// let TP = new TranslationProviders();
// TP.getTranslationFile().then((providers: any) => {
// const options: any = { providers };

class Application {
  private baseUrl: string = baseUrl;
  private portal: string = portal;
  private endpoint: string = '/api/identities/v1/configuration/site?siteName=';
  private headers: { [name: string]: any } = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  public load() {
    if (this.externalDataLoaded()) {
      this.start();
    } else {
      this.loadExternalData()
        .then(this.start);
    }
  }

  private loadExternalData() {
    return fetch(this.baseUrl + this.endpoint + this.portal, this.headers)
      .then((response: any) => response.json())
      .then((response: any) => {
        localStorage.setItem(
          'uiConfig',
          JSON.stringify(Object.assign(response, { loaded: true }))
        );
      });
  }

  private start() {
    platformBrowserDynamic().bootstrapModule(AppModule/*, options*/);
  }

  private externalDataLoaded() {
    const config = JSON.parse(localStorage.getItem('uiConfig'));
    return config && config.loaded;
  }
}

new Application().load();
