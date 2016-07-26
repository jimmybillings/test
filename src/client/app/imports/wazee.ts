
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
import { CollectionsService } from '../+collection/services/collections.service';
import { ActiveCollectionService } from '../+collection/services/active-collection.service';
import { UiState } from '../shared/services/ui.state';
import { AdminAuthGuard } from '../+admin/services/admin.auth.guard';
import { UserPermission } from '../shared/services/permission.service';
import { AssetGuard } from '../+asset/services/asset.guard';
import { AssetData } from '../+search/services/asset.data.service';

// WAZEE ROUTES
import {APP_ROUTES} from '../app.routes';

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
import { collections} from '../+collection/services/collections.service';
import { activeCollection} from '../+collection/services/active-collection.service';
import { filters } from '../+search/services/filter.service';

// TRANSLATIONS
import { TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { MultilingualService } from '../shared/services/multilingual.service';
import { createOverlayContainer } from '@angular2-material/core/overlay/overlay-container';
import { OVERLAY_CONTAINER_TOKEN } from '@angular2-material/core/overlay/overlay';

export const WAZEE_PROVIDERS = [
  ApiConfig,
  CurrentUser,
  UiConfig,
  Error,
  AssetService,
  CollectionsService,
  ActiveCollectionService,
  SearchContext,
  AssetData,
  Authentication,
  TranslateService,
  MultilingualService,
  UiState,
  AdminAuthGuard,
  AssetGuard,
  UserPermission,
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'), deps: [Http]
  }),
  TranslateService,
  provide(OVERLAY_CONTAINER_TOKEN, { useValue: createOverlayContainer() }),
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
    activeCollection,
    uiState,
    filters,
    i18n: multilingualReducer
  })
];

export const WAZEE_ROUTES: RouterConfig = [
  ...APP_ROUTES
];
