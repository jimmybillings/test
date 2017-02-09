import { Routes } from '@angular/router';

// WAZEE SERVICES
import { ApiConfig } from '../shared/services/api.config';
import { MultilingualService } from '../shared/services/multilingual.service';
import { TranslateService } from 'ng2-translate';
import { CurrentUserService } from '../shared/services/current-user.service';
import { UserService } from '../shared/services/user.service';
import { UiConfig } from '../shared/services/ui.config';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';
import { AssetService } from '../shared/services/asset.service';
import { SearchContext } from '../shared/services/search-context.service';
import { CollectionsService } from '../shared/services/collections.service';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
import { UiState } from '../shared/services/ui.state';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { ApiService } from '../shared/services/api.service';
import { SortDefinitionsService } from '../shared/services/sort-definitions.service';
import { FilterService } from '../shared/services/filter.service';
import { Authentication } from '../shared/services/authentication.data.service';
import { PendoService } from '../shared/services/pendo.service';
import { CartService } from '../shared/services/cart.service';
import { SearchService } from '../shared/services/search.service';
import { OrderService } from '../shared/services/order.service';
import { OrdersService } from '../shared/services/orders.service';
import { CollectionContextService } from '../shared/services/collection-context.service';

// STORE INTERFACES
import { CartStore } from '../shared/stores/cart.store';
import { FeatureStore } from '../shared/stores/feature.store';
import { SearchStore } from '../shared/stores/search.store';
import { OrderStore } from '../shared/stores/order.store';
import { OrdersStore } from '../shared/stores/orders.store';
import { ErrorStore } from '../shared/stores/error.store';
import { CollectionsStore } from '../shared/stores/collections.store';
import { ActiveCollectionStore } from '../shared/stores/active-collection.store';

// GUARDS
import { CartGuard } from '../+commerce/+cart/services/cart.guard';
import { LoggedInGuard } from '../+user-management/services/logged-in.guard';
import { LoggedOutGuard } from '../+user-management/services/logged-out.guard';
import { AdminAuthGuard } from '../+admin/services/admin.auth.guard';
import { AssetGuard } from '../+asset/services/asset.guard';

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
import { collections } from '../shared/stores/collections.store';
import { activeCollection } from '../shared/stores/active-collection.store';
import { filters } from '../shared/services/filter.service';
import { userPreferences } from '../shared/services/user-preference.service';
import { collectionOptions } from '../shared/services/collection-context.service';
import { cart } from '../shared/stores/cart.store';
import { sortDefinitions } from '../shared/services/sort-definitions.service';
import { order } from '../shared/stores/order.store';
import { orders } from '../shared/stores/orders.store';
import { features } from '../shared/stores/feature.store';

// WAZEE RESOLVERS
import { AssetResolver } from '../+asset/services/asset.resolver';
import { SearchResolver } from '../+search/services/search.resolver';
import { CartResolver } from '../+commerce/+cart/services/cart.resolver';
import { OrderResolver } from '../+commerce/+order/services/order.resolver';
import { OrdersResolver } from '../+commerce/+order/services/orders.resolver';

export const WAZEE_RESOLVERS = [
  AssetResolver,
  SearchResolver,
  CartResolver,
  OrderResolver,
  OrdersResolver
];

export const WAZEE_GUARDS = [
  AdminAuthGuard,
  AssetGuard,
  CartGuard,
  LoggedInGuard,
  LoggedOutGuard
];

export const WAZEE_SERVICES = [
  ApiConfig,
  CurrentUserService,
  UiConfig,
  AssetService,
  WzNotificationService,
  CollectionsService,
  ActiveCollectionService,
  SearchContext,
  MultilingualService,
  UiState,
  UserPreferenceService,
  CollectionContextService,
  ApiService,
  SortDefinitionsService,
  Capabilities,
  FilterService,
  Authentication,
  PendoService,
  CartService,
  SearchService,
  UserService,
  OrderService,
  OrdersService,
  TranslateService
];

export const WAZEE_STORE_INTERFACES = [
  ErrorStore,
  CollectionsStore,
  ActiveCollectionStore,
  CartStore,
  FeatureStore,
  SearchStore,
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

// WAZEE ROUTES
import { APP_ROUTES } from '../app.routes';

export const WAZEE_ROUTES: Routes = [
  ...APP_ROUTES
];
