
import { provide, Provider } from '@angular/core';
import { Http } from '@angular/http';

// WAZEE PROVIDERS
import { ApiConfig } from '../shared/services/api.config';
import { CurrentUser} from '../shared/services/current-user.model';
import { UiConfig } from '../shared/services/ui.config';
import { Error } from '../shared/services/error.service';
import { AssetService} from '../+asset/services/asset.service';

// WAZEE STORES
import { assets } from '../+search/services/asset.data.service';
import { asset } from '../+asset/services/asset.service';
import { currentUser} from '../shared/services/current-user.model';
import { config } from '../shared/services/ui.config';
import { adminResources } from '../+admin/services/admin.service';
import { searchContext} from '../shared/services/search-context.service';
import { provideStore } from '@ngrx/store';
import { multilingualReducer } from '../shared/services/multilingual.service';

// TRANSLATIONS
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { MultilingualService } from '../shared/services/multilingual.service';

// export const MATERIAL_PIPES = [

// ];

// export const WAZEE_DIRECTIVES = [

// ];

export const WAZEE_PROVIDERS = [
  ApiConfig,
  CurrentUser,
  UiConfig,
  Error,
  AssetService,
  TranslateService,
  MultilingualService,
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  }),
];

export const WAZEE_STORES = [
  provideStore({
    config,
    assets,
    asset,
    currentUser,
    adminResources,
    searchContext,
    i18n: multilingualReducer
  })
];

