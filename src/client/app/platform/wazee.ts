
import { provide, Provider } from '@angular/core';
import { Http } from '@angular/http';
import { RouterConfig } from '@angular/router';

// WAZEE PROVIDERS
import { ApiConfig } from '../shared/services/api.config';
import { CurrentUser} from '../shared/services/current-user.model';
import { UiConfig } from '../shared/services/ui.config';
import { Error } from '../shared/services/error.service';
import { AssetService} from '../+asset/services/asset.service';
import { SearchContext} from '../shared/services/search-context.service';
import { Authentication} from '../+user-management/services/authentication.data.service';
import { CollectionsService } from '../+collections/services/collections.service';
import { UiState } from '../shared/services/ui.state';

// WAZEE ROUTES
import {APP_ROUTES} from '../app.component';

// WAZEE STORES
import { assets } from '../+search/services/asset.data.service';
import { asset } from '../+asset/services/asset.service';
import { currentUser} from '../shared/services/current-user.model';
import { config } from '../shared/services/ui.config';
import { uiState } from '../shared/services/ui.state';
import { adminResources } from '../+admin/services/admin.service';
import { searchContext} from '../shared/services/search-context.service';
import { provideStore } from '@ngrx/store';
import { multilingualReducer } from '../shared/services/multilingual.service';
import { collections, focusedCollection} from '../+collections/services/collections.service';

// TRANSLATIONS
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { MultilingualService } from '../shared/services/multilingual.service';

// export const MATERIAL_PIPES = [];
// export const WAZEE_DIRECTIVES = [];

export const WAZEE_PROVIDERS = [
  ApiConfig,
  CurrentUser,
  UiConfig,
  Error,
  AssetService,
  CollectionsService,
  SearchContext,
  Authentication,
  TranslateService,
  MultilingualService,
  UiState,
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  }),
];

export const WAZEE_STORES: Provider[][] = [
  provideStore({
    config,
    assets,
    asset,
    currentUser,
    adminResources,
    searchContext,
    collections,
    focusedCollection,
    uiState,
    i18n: multilingualReducer
  })
];

export const WAZEE_ROUTES: RouterConfig = [
  ...APP_ROUTES
];
