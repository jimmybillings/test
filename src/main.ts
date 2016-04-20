import { provide, enableProdMode } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';
import { HTTP_PROVIDERS, HTTP_BINDINGS, Http } from 'angular2/http';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { MultilingualService, multilingualReducer } from './common/services/multilingual.service';
import { provideStore } from '@ngrx/store';
import { assets } from './containers/search/services/asset.data.service';
import { asset } from './containers/asset/services/asset.service';
import { Validators } from 'angular2/common';
import { AppComponent } from './app.component';
import { ApiConfig } from './common/config/api.config';
import { CurrentUser, currentUser} from './common/models/current-user.model';
import { MATERIAL_PROVIDERS } from 'ng2-material/all';
import { UiConfig, config } from './common/config/ui.config';
import 'rxjs/Rx';
// enable prod mode
if ('<%= ENV %>' === 'prod') { enableProdMode(); }


bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  MATERIAL_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' }),
  provideStore({config, assets, asset, currentUser, i18n: multilingualReducer}),
  HTTP_PROVIDERS,
  HTTP_BINDINGS,
  provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'resources/i18n', '.json'),
        deps: [Http]
    }),
  MultilingualService,
  TranslateService,
  Validators,
  ApiConfig,
  CurrentUser,
  UiConfig
]);

