// Shared Angular Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from './modules/wz-design/wz-design.module';
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
import { OrderService } from './services/order.service';
import { OrdersService } from './services/orders.service';
import { CollectionContextService } from './services/collection-context.service';
import { GalleryViewService } from './services/gallery-view.service';
import { WindowRef } from './services/window-ref.service';
import { QuoteService } from './services/quote.service';
import { QuotesService } from './services/quotes.service';
import { QuoteEditService } from './services/quote-edit.service';
import { PricingService } from './services/pricing.service';
// New-ish services
import { AssetService } from '../store/services/asset.service';
import { FutureCartService } from '../store/services/cart.service';
import { CommentService } from '../store/services/comment.service';
import { FutureApiService } from '../store/services/api.service';
import { ActiveCollectionService } from '../store/services/active-collection.service';
import { SnackbarService } from '../store/services/snackbar.service';
import { SpeedPreviewService } from '../store/services/speed-preview.service';


// WAZEE STORES
import {
  AppStore
  // reducers
} from '../app.store';
import * as ActiveCollectionState from '../store/states/active-collection.state';
import * as CartState from '../store/states/cart.state';
import * as CartAssetState from '../store/states/cart-asset.state';
import * as ActiveCollectionAssetActions from '../store/states/active-collection-asset.state';
import * as CommentState from '../store/states/comment.state';
import * as OrderState from '../store/states/order.state';
import * as SearchAssetState from '../store/states/search-asset.state';
import * as SnackbarState from '../store/states/snackbar.state';
import * as SpeedPreviewState from '../store/states/speed-preview.state';

import { searchStore, SearchStore } from './stores/search.store';
import { collections, CollectionsStore } from './stores/collections.store';
import { orders, OrdersStore } from './stores/orders.store';
import { features, FeatureStore } from './stores/feature.store';
import { gallery, GalleryViewStore } from './stores/gallery-view.store';
import { quote, QuoteStore } from './stores/quote.store';
import { quotes, QuotesStore } from './stores/quotes.store';
import { activeQuote, ActiveQuoteStore } from './stores/active-quote.store';
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
import { ActiveCollectionEffects } from '../store/effects/active-collection.effects';
import { SearchAssetEffects } from '../store/effects/search-asset.effects';
import { CartEffects } from '../store/effects/cart.effects';
import { CartAssetEffects } from '../store/effects/cart-asset.effects';
import { ActiveCollectionAssetEffects } from '../store/effects/active-collection-asset.effects';
import { CommentEffects } from '../store/effects/comment.effects';
import { DialogEffects } from '../store/effects/dialog.effects';
import { ErrorEffects } from '../store/effects/error.effects';
import { NotifierEffects } from '../store/effects/notifier.effects';
import { RouterEffects } from '../store/effects/router.effects';
import { SnackbarEffects } from '../store/effects/snackbar.effects';
import { SpeedPreviewEffects } from '../store/effects/speed-preview.effects';

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
  QuoteStore,
  QuotesStore,
  ActiveQuoteStore,
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
  quote: quote,
  quotes: quotes,
  activeQuote: activeQuote,
  checkout: checkout,
  feeConfig: feeConfig,
  paymentReducer: pricingReducer,
  // REDUX 200000.0.0
  activeCollection: ActiveCollectionState.reducer,
  activeCollectionAsset: ActiveCollectionAssetActions.reducer,
  cart: CartState.reducer,
  cartAsset: CartAssetState.reducer,
  comment: CommentState.reducer,
  order: OrderState.reducer,
  searchAsset: SearchAssetState.reducer,
  snackbar: SnackbarState.reducer,
  speedPreview: SpeedPreviewState.reducer
};

const WAZEE_EFFECTS = EffectsModule.forRoot([
  ActiveCollectionEffects,
  SearchAssetEffects,
  CartEffects,
  CartAssetEffects,
  ActiveCollectionAssetEffects,
  CommentEffects,
  DialogEffects,
  ErrorEffects,
  NotifierEffects,
  RouterEffects,
  SnackbarEffects,
  SpeedPreviewEffects
]);

// Shared pipes
import { ValuesPipe } from './pipes/values.pipe';

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, 'https://', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),
    HttpModule,
    ReactiveFormsModule,
    MaterialModule,
    WzPlayerModule,
    WzFormModule,
    WzAssetModule,
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
    HttpModule,
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
