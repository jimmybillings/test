import { Routes } from '@angular/router';

// WAZEE PROVIDERS
import { ApiConfig } from '../shared/services/api.config';
// import { AppEventService } from '../shared/services/app-event.service';
import { CurrentUser } from '../shared/services/current-user.model';
import { UiConfig } from '../shared/services/ui.config';
import { ErrorService, ErrorActions } from '../shared/services/error.service';
import { AssetService } from '../shared/services/asset.service';
import { SearchContext } from '../shared/services/search-context.service';
import { CollectionsService } from '../shared/services/collections.service';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
import { UiState } from '../shared/services/ui.state';
import { AdminAuthGuard } from '../+admin/services/admin.auth.guard';
import { AssetGuard } from '../+asset/services/asset.guard';
import { LoggedInGuard } from '../+user-management/services/logged-in.guard';
import { LoggedOutGuard } from '../+user-management/services/logged-out.guard';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { ApiService } from '../shared/services/api.service';
import { SortDefinitionsService } from '../shared/services/sort-definitions.service';
import { CartGuard } from '../+commerce/+cart/services/cart.guard';
import { CartSummaryService } from '../shared/services/cart-summary.service';
import { FilterService } from '../shared/services/filter.service';
import { Authentication } from '../shared/services/authentication.data.service';
import { PendoService } from '../shared/services/pendo.service';

// WAZEE ROUTES
import { APP_ROUTES } from '../app.routes';

// WAZEE STORES
import { assets } from '../+search/services/asset.store';
import { asset } from '../shared/services/asset.service';
import { currentUser } from '../shared/services/current-user.model';
import { config } from '../shared/services/ui.config';
import { uiState } from '../shared/services/ui.state';
import { Capabilities } from '../shared/services/capabilities.service';
import { adminResources } from '../+admin/services/admin.store';
import { searchContext } from '../shared/services/search-context.service';
import { error } from '../shared/services/error.service';
import { multilingualActionReducer } from '../shared/services/multilingual.service';
import { collections } from '../shared/services/collections.service';
import { activeCollection } from '../shared/services/active-collection.service';
import { filters } from '../shared/services/filter.service';
import { userPreferences } from '../shared/services/user-preference.service';
import { CollectionContextService, collectionOptions } from '../shared/services/collection-context.service';
import { cart } from '../+commerce/+cart/services/cart.store';
import { sortDefinitions } from '../shared/services/sort-definitions.service';
import { cartSummary } from '../shared/services/cart-summary.service';
import { order } from '../+commerce/+order/services/order.store';
import { orders } from '../+commerce/+order/services/orders.store';

// TRANSLATIONS
import { MultilingualService } from '../shared/services/multilingual.service';

export const WAZEE_PROVIDERS = [
  ApiConfig,
  CurrentUser,
  UiConfig,
  ErrorService,
  ErrorActions,
  AssetService,
  CollectionsService,
  ActiveCollectionService,
  SearchContext,
  MultilingualService,
  UiState,
  AdminAuthGuard,
  AssetGuard,
  UserPreferenceService,
  CollectionContextService,
  ApiService,
  SortDefinitionsService,
  CartGuard,
  Capabilities,
  LoggedInGuard,
  LoggedOutGuard,
  CartSummaryService,
  FilterService,
  Authentication,
  PendoService
];

export const WAZEE_STORES: any = {
  config: config,
  assets: assets,
  asset: asset,
  currentUser: currentUser,
  adminResources: adminResources,
  searchContext: searchContext,
  collections: collections,
  activeCollection: activeCollection,
  uiState: uiState,
  filters: filters,
  userPreferences: userPreferences,
  collectionOptions: collectionOptions,
  i18n: multilingualActionReducer,
  error: error,
  cart: cart,
  sortDefinitions: sortDefinitions,
  cartSummary: cartSummary,
  order: order,
  orders: orders
};

export const WAZEE_ROUTES: Routes = [
  ...APP_ROUTES
];
