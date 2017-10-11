// Shared Angular Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from './modules/wz-design/wz.design.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

// Shared Wazee Modules
import { WzPlayerModule } from './modules/wz-player/wz.player.module';
import { WzFormModule } from './modules/wz-form/wz-form.module';
import { WzAssetModule } from './modules/wz-asset/wz-asset.module';
import { WzDialogModule } from './modules/wz-dialog/wz.dialog.module';


// Shared Pure Components
import { WzBreadcrumbComponent } from './components/wz-breadcrumb/wz.breadcrumb.component';
import { WzDropdownComponent, WzDropdownPortalDirective } from './components/wz-dropdown/wz.dropdown.component';
import { WzPaginationComponent } from './components/wz-pagination/wz.pagination.component';
import { WzClipBoardDirective } from './components/wz-clipboard/wz-clipboard.directive';
import { CollectionSortDdComponent } from '../+collection/components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from '../+collection/components/collections-filter-dd.component';
import { WzItemSearchFormComponent } from './components/wz-item-search-form/wz.item-search-form.component';
import { CollectionFormComponent } from '../application/collection-tray/components/collection-form.component';
import { WzSortComponent } from './components/wz-sort/wz.sort.component';
import { CollectionLinkComponent } from '../+collection/components/collection-link.component';
import { WzTermsComponent } from './components/wz-terms/wz.terms.component';
import { WzPricingComponent } from './components/wz-pricing/wz.pricing.component';
import { WzComingSoonComponent } from './components/wz-coming-soon/wz-coming-soon.component';
import { WzSubclipEditorComponent } from './components/wz-subclip-editor/wz.subclip-editor.component';
import { WzGalleryTwoLevelComponent } from './components/wz-gallery-two-level/wz.gallery-two-level.component';
import { WzGalleryBreadcrumbComponent } from './components/wz-gallery-breadcrumb/wz.gallery-breadcrumb.component';
import { WzSiteChangerComponent } from './components/wz-site-changer/wz-site-changer.component';
import { WzNotFoundComponent } from './components/wz-not-found/wz-not-found.component';
import { WzCommentComponent } from './components/wz-comment/wz.comment.component';

// WAZEE SERVICES
import { ApiConfig } from './services/api.config';
import { MultilingualService } from './services/multilingual.service';
import { TranslateService } from '@ngx-translate/core';
import { CurrentUserService } from './services/current-user.service';
import { UserService } from './services/user.service';
import { UiConfig } from './services/ui.config';
import { SearchContext } from './services/search-context.service';
import { CollectionsService } from './services/collections.service';
import { UiState } from './services/ui.state';
import { UserPreferenceService } from './services/user-preference.service';
import { ApiService } from './services/api.service';
import { SortDefinitionsService } from './services/sort-definitions.service';
import { FilterService } from './services/filter.service';
import { Authentication } from './services/authentication.data.service';
import { PendoService } from './services/pendo.service';
import { CartService } from './services/cart.service';
import { SearchService } from './services/search.service';
import { OrdersService } from './services/orders.service';
import { CollectionContextService } from './services/collection-context.service';
import { GalleryViewService } from './services/gallery-view.service';
import { WindowRef } from './services/window-ref.service';
import { QuoteService } from './services/quote.service';
import { QuotesService } from './services/quotes.service';
import { QuoteEditService } from './services/quote-edit.service';
import { PricingService } from './services/pricing.service';
// New-ish services
import { AssetService } from '../store/asset/asset.service';
import { ActiveCollectionService } from '../store/active-collection/active-collection.service';
import { CommentService } from '../store/comment/comment.service';
import { FutureApiService } from '../store/api/api.service';
import { FutureCartService } from '../store/cart/cart.service';
import { FutureQuoteEditService } from '../store/quote-edit/quote-edit.service';
import { FutureQuoteShowService } from '../store/quote-show/quote-show.service';
import { OrderService } from '../store/order/order.service';
import { SnackbarService } from '../store/snackbar/snackbar.service';
import { SpeedPreviewService } from '../store/speed-preview/speed-preview.service';

// WAZEE STORES
import {
  AppStore
  // reducers
} from '../app.store';

import * as ActiveCollectionState from '../store/active-collection/active-collection.state';
import * as ActiveCollectionAssetState from '../store/active-collection-asset/active-collection-asset.state';
import * as CartState from '../store/cart/cart.state';
import * as CartAssetState from '../store/cart-asset/cart-asset.state';
import * as CommentState from '../store/comment/comment.state';
import * as LoadingIndicatorState from '../store/loading-indicator/loading-indicator.state';
import * as OrderState from '../store/order/order.state';
import * as OrderAssetState from '../store/order-asset/order-asset.state';
import * as QuoteEditState from '../store/quote-edit/quote-edit.state';
import * as QuoteShowState from '../store/quote-show/quote-show.state';
import * as QuoteEditAssetState from '../store/quote-edit-asset/quote-edit-asset.state';
import * as QuoteShowAssetState from '../store/quote-show-asset/quote-show-asset.state';
import * as SearchAssetState from '../store/search-asset/search-asset.state';
import * as SnackbarState from '../store/snackbar/snackbar.state';
import * as SpeedPreviewState from '../store/speed-preview/speed-preview.state';

import { searchStore, SearchStore } from './stores/search.store';
import { collections, CollectionsStore } from './stores/collections.store';
import { orders, OrdersStore } from './stores/orders.store';
import { features, FeatureStore } from './stores/feature.store';
import { gallery, GalleryViewStore } from './stores/gallery-view.store';
import { quotes, QuotesStore } from './stores/quotes.store';
import { checkout, CheckoutStore } from './stores/checkout.store';
import { feeConfig, FeeConfigStore } from './stores/fee-config.store';
import { pricingReducer, PricingStore } from './stores/pricing.store';

import { currentUser } from './services/current-user.service';
import { config } from './services/ui.config';
import { uiState } from './services/ui.state';
import { Capabilities } from './services/capabilities.service';
import { searchContext } from './services/search-context.service';
import { multilingualActionReducer } from './services/multilingual.service';
import { filters } from './services/filter.service';
import { userPreferences } from './services/user-preference.service';
import { collectionOptions } from './services/collection-context.service';
import { sortDefinitions } from './services/sort-definitions.service';

// WAZEE EFFECTS
import { ActiveCollectionAssetEffects } from '../store/active-collection-asset/active-collection-asset.effects';
import { ActiveCollectionEffects } from '../store/active-collection/active-collection.effects';
import { CartEffects } from '../store/cart/cart.effects';
import { CartAssetEffects } from '../store/cart-asset/cart-asset.effects';
import { CommentEffects } from '../store/comment/comment.effects';
import { DialogEffects } from '../store/dialog/dialog.effects';
import { ErrorEffects } from '../store/error/error.effects';
import { NotifierEffects } from '../store/notifier/notifier.effects';
import { OrderEffects } from '../store/order/order.effects';
import { OrderAssetEffects } from '../store/order-asset/order-asset.effects';
import { QuoteEditEffects } from '../store/quote-edit/quote-edit.effects';
import { QuoteShowEffects } from '../store/quote-show/quote-show.effects';
import { QuoteEditAssetEffects } from '../store/quote-edit-asset/quote-edit-asset.effects';
import { QuoteShowAssetEffects } from '../store/quote-show-asset/quote-show-asset.effects';
import { RouterEffects } from '../store/router/router.effects';
import { SearchAssetEffects } from '../store/search-asset/search-asset.effects';
import { SnackbarEffects } from '../store/snackbar/snackbar.effects';
import { SpeedPreviewEffects } from '../store/speed-preview/speed-preview.effects';

const WAZEE_SERVICES = [
  ApiConfig,
  CurrentUserService,
  UiConfig,
  AssetService,
  CollectionsService,
  ActiveCollectionService,
  SearchContext,
  MultilingualService,
  UiState,
  UserPreferenceService,
  CollectionContextService,
  ApiService,
  FutureApiService,
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
  TranslateService,
  GalleryViewService,
  WindowRef,
  FutureQuoteEditService,
  FutureQuoteShowService,
  QuoteService,
  QuotesService,
  QuoteEditService,
  SnackbarService,
  CommentService,
  FutureCartService,
  SpeedPreviewService,
  PricingService
];

const WAZEE_STORE_INTERFACES = [
  CollectionsStore,
  FeatureStore,
  SearchStore,
  OrdersStore,
  GalleryViewStore,
  QuotesStore,
  CheckoutStore,
  FeeConfigStore,
  PricingStore
];

const WAZEE_PROVIDERS: any = [
  AppStore,
  ...WAZEE_SERVICES,
  ...WAZEE_STORE_INTERFACES
];


const WAZEE_STORES: any = {
  config: config,
  searchStore: searchStore,
  currentUser: currentUser,
  searchContext: searchContext,
  collections: collections,
  uiState: uiState,
  filters: filters,
  userPreferences: userPreferences,
  collectionOptions: collectionOptions,
  i18n: multilingualActionReducer,
  sortDefinitions: sortDefinitions,
  orders: orders,
  features: features,
  gallery: gallery,
  quotes: quotes,
  checkout: checkout,
  feeConfig: feeConfig,
  paymentReducer: pricingReducer,
  // REDUX 200000.0.0
  activeCollection: ActiveCollectionState.reducer,
  activeCollectionAsset: ActiveCollectionAssetState.reducer,
  cart: CartState.reducer,
  cartAsset: CartAssetState.reducer,
  comment: CommentState.reducer,
  loadingIndicator: LoadingIndicatorState.reducer,
  order: OrderState.reducer,
  orderAsset: OrderAssetState.reducer,
  quoteEdit: QuoteEditState.reducer,
  quoteEditAsset: QuoteEditAssetState.reducer,
  quoteShow: QuoteShowState.reducer,
  quoteShowAsset: QuoteShowAssetState.reducer,
  searchAsset: SearchAssetState.reducer,
  snackbar: SnackbarState.reducer,
  speedPreview: SpeedPreviewState.reducer
};

const WAZEE_EFFECTS = EffectsModule.forRoot([
  ActiveCollectionEffects,
  ActiveCollectionAssetEffects,
  CartEffects,
  CartAssetEffects,
  CommentEffects,
  DialogEffects,
  ErrorEffects,
  NotifierEffects,
  OrderEffects,
  OrderAssetEffects,
  QuoteEditEffects,
  QuoteShowEffects,
  QuoteEditAssetEffects,
  QuoteShowAssetEffects,
  RouterEffects,
  SearchAssetEffects,
  SnackbarEffects,
  SpeedPreviewEffects
]);

// Shared pipes
import { ValuesPipe } from './pipes/values.pipe';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'https://', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // HttpModule,
    // HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    MaterialModule,
    WzPlayerModule,
    WzFormModule,
    // WzAssetModule,
    WzDialogModule,
    StoreModule.forRoot(WAZEE_STORES),  // Eventually this will be just the reducers object from app.store.ts
    // TODO: Get StoreDevtoolsModule out of production!!!  (Looks scary, though:
    // https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md)
    StoreDevtoolsModule.instrument(),
    WAZEE_EFFECTS
  ],
  declarations: [
    WzGalleryBreadcrumbComponent,
    WzBreadcrumbComponent,
    WzDropdownComponent,
    WzPaginationComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    WzItemSearchFormComponent,
    ValuesPipe,
    WzDropdownPortalDirective,
    CollectionFormComponent,
    WzSortComponent,
    CollectionLinkComponent,
    WzClipBoardDirective,
    WzTermsComponent,
    WzPricingComponent,
    WzComingSoonComponent,
    WzGalleryTwoLevelComponent,
    WzSubclipEditorComponent,
    WzSiteChangerComponent,
    WzNotFoundComponent,
    WzCommentComponent
  ],
  exports: [
    StoreModule,
    HttpClientModule,
    HttpModule,
    WzGalleryBreadcrumbComponent,
    WzBreadcrumbComponent,
    WzDropdownComponent,
    WzPaginationComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    WzItemSearchFormComponent,
    ValuesPipe,
    WzDropdownPortalDirective,
    CollectionFormComponent,
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    WzPlayerModule,
    WzSortComponent,
    CollectionLinkComponent,
    WzClipBoardDirective,
    WzTermsComponent,
    WzAssetModule,
    WzPricingComponent,
    WzComingSoonComponent,
    WzFormModule,
    WzGalleryTwoLevelComponent,
    WzSubclipEditorComponent,
    WzSiteChangerComponent,
    WzNotFoundComponent,
    WzCommentComponent
  ],
  entryComponents: [
    CollectionLinkComponent,
    CollectionFormComponent,
    WzTermsComponent,
    WzPricingComponent,
    WzComingSoonComponent,
    WzSubclipEditorComponent
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [WAZEE_PROVIDERS]
    };
  }
}
