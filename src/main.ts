import { provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy } from 'angular2/router';
import { HTTP_PROVIDERS, HTTP_BINDINGS, Http } from 'angular2/http';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { MultilingualService, multilingualReducer } from './common/services/multilingual.service';
import { provideStore } from '@ngrx/store';
import { assets } from './containers/search/services/asset.data.service';
import { asset, AssetService } from './containers/asset/services/asset.service';
import { Validators } from 'angular2/common';
import { AppComponent } from './app.component';
import { ApiConfig } from './common/config/api.config';
import { CurrentUser, currentUser} from './common/models/current-user.model';
import { MATERIAL_PROVIDERS } from 'ng2-material/all';
import { UiConfig, config } from './common/config/ui.config';
import 'rxjs/Rx';
// import { enableProdMode } from 'angular2/core';
// enableProdMode();

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  MATERIAL_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  provideStore({config, assets, asset, currentUser, i18n: multilingualReducer}),
  HTTP_PROVIDERS,
  HTTP_BINDINGS,
  provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'resources/i18n', '.json'),
        deps: [Http]
    }),
  // use TranslateService here, and not TRANSLATE_PROVIDERS (which will define a default TranslateStaticLoader)
  MultilingualService,
  TranslateService,
  Validators,
  ApiConfig,
  CurrentUser,
  UiConfig,
  AssetService
]);

