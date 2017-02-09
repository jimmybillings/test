import { Routes } from '@angular/router';
import { Renderer } from '@angular/core';
// WAZEE PROVIDERS
import { ApiConfig } from '../shared/services/api.config';
// import { AppEventService } from '../shared/services/app-event.service';
import { CurrentUserService } from '../shared/services/current-user.service';
import { UserService } from '../shared/services/user.service';
import { UiConfig } from '../shared/services/ui.config';
import { ErrorStore } from '../shared/stores/error.store';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';
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
import { FilterService } from '../shared/services/filter.service';
import { Authentication } from '../shared/services/authentication.data.service';
import { PendoService } from '../shared/services/pendo.service';
import { CartService } from '../shared/services/cart.service';
import { CartStore } from '../shared/stores/cart.store';
import { FeatureStore } from '../shared/stores/feature.store';
import { SearchService } from '../shared/services/search.service';
import { SearchStore } from '../shared/stores/search.store';
import { OrderService } from '../shared/services/order.service';
import { OrdersService } from '../shared/services/orders.service';
import { OrderStore } from '../shared/stores/order.store';
import { OrdersStore } from '../shared/stores/orders.store';
// WAZEE ROUTES
import { APP_ROUTES } from '../app.routes';

// WAZEE STORES

import { searchStore } from '../shared/stores/search.store';
import { asset } from '../shared/services/asset.service';
import { currentUser } from '../shared/services/current-user.service';
import { config } from '../shared/services/ui.config';
import { uiState } from '../shared/services/ui.state';
import { Capabilities } from '../shared/services/capabilities.service';
import { adminResources } from '../+admin/services/admin.store';
import { searchContext } from '../shared/services/search-context.service';
import { errorStore } from '../shared/stores/error.store';
import { multilingualActionReducer } from '../shared/services/multilingual.service';
import { CollectionsStore, collections } from '../shared/stores/collections.store';
import { ActiveCollectionStore, activeCollection } from '../shared/stores/active-collection.store';
import { filters } from '../shared/services/filter.service';
import { userPreferences } from '../shared/services/user-preference.service';
import { CollectionContextService, collectionOptions } from '../shared/services/collection-context.service';
import { cart } from '../shared/stores/cart.store';
import { sortDefinitions } from '../shared/services/sort-definitions.service';
import { order } from '../shared/stores/order.store';
import { orders } from '../shared/stores/orders.store';
import { features } from '../shared/stores/feature.store';

// TRANSLATIONS
import { MultilingualService } from '../shared/services/multilingual.service';

export const WAZEE_PROVIDERS = [
  Renderer,
  ApiConfig,
  CurrentUserService,
  UiConfig,
  ErrorStore,
  AssetService,
  WzNotificationService,
  CollectionsStore,
  CollectionsService,
  ActiveCollectionStore,
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
  FilterService,
  Authentication,
  PendoService,
  CartService,
  CartStore,
  FeatureStore,
  SearchService,
  SearchStore,
  UserService,
  OrderService,
  OrdersService,
  OrdersStore,
  OrderStore
];

export const WAZEE_STORES: any = {
  config: config,
  searchStore: searchStore,
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
  errorStore: errorStore,
  cart: cart,
  sortDefinitions: sortDefinitions,
  order: order,
  orders: orders,
  features: features
};

export const WAZEE_ROUTES: Routes = [
  ...APP_ROUTES
];
