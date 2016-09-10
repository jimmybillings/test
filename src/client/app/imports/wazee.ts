
import { Routes } from '@angular/router';

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
import { FilterService } from '../+search/services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
// import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';

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

import { multilingualActionReducer } from '../shared/services/multilingual.service';
import { collections } from '../+collection/services/collections.service';
import { activeCollection } from '../+collection/services/active-collection.service';
import { filters } from '../+search/services/filter.service';
import { userPreferences } from '../shared/services/user-preference.service';
import { CollectionContextService, collectionOptions } from '../shared/services/collection-context.service';

// TRANSLATIONS
import { MultilingualService } from '../shared/services/multilingual.service';

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
  MultilingualService,
  UiState,
  AdminAuthGuard,
  AssetGuard,
  UserPermission,
  FilterService,
  UserPreferenceService,
  CollectionContextService
  // WzNotificationService
];

export const WAZEE_STORES: any = {
    config: config,
    assets: assets,
    asset: asset,
    currentUser: currentUser,
    adminResources:adminResources,
    searchContext:searchContext,
    collections:collections,
    activeCollection:activeCollection,
    uiState:uiState,
    filters:filters,
    userPreferences:userPreferences,
    collectionOptions:collectionOptions,
    i18n: multilingualActionReducer
};

export const WAZEE_ROUTES: Routes = [
  ...APP_ROUTES
];
