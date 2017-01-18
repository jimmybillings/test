// Shared Angular Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService, TranslateParser } from 'ng2-translate';
import { MaterialModule } from '@angular/material';

// Shared Pure Components
import { WzNotificationComponent } from './components/wz-notification/wz.notification.component';
import { WzAssetListComponent } from './components/wz-asset-list/wz.asset-list.component';
import { WzBreadcrumbComponent } from './components/wz-breadcrumb/wz.breadcrumb.component';
import { WzDialogComponent, WzDialogPortalDirective } from './components/wz-dialog/wz.dialog.component';
import { WzDropdownComponent, WzDropdownPortalDirective } from './components/wz-dropdown/wz.dropdown.component';
import { WzFormComponent } from './components/wz-form/wz.form.component';
import { WzListComponent } from './components/wz-list/wz.list.component';
import { WzPaginationComponent } from './components/wz-pagination/wz.pagination.component';
import { WzPikaDayDirective } from './components/wz-pikaday/wz-pikaday.directive';
import { WzClipBoardDirective } from './components/wz-clipboard/wz-clipboard.directive';
import { WzPlayerComponent } from './components/player/wz-player/wz.player.component';
import { WzAdvancedPlayerComponent } from './components/player/wz-advanced-player/wz.advanced-player.component';
import { WzSubclipControlbarComponent } from './components/player/wz-subclip-controlbar/wz.subclip-controlbar.component';
import { WzPlayerControlbarComponent } from './components/player/wz-player-controlbar/wz.player-controlbar.component';
import { WzPlaybackToggleButtonComponent }
  from './components/player/controls/wz-playback-toggle-button/wz.playback-toggle-button.component';
import { WzTimeDisplayComponent } from './components/player/controls/wz-time-display/wz.time-display.component';
import { CollectionSortDdComponent } from '../+collection/components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from '../+collection/components/collections-filter-dd.component';
import { WzItemSearchFormComponent } from './components/wz-item-search-form/wz.item-search-form.component';
import { WzInputTagsComponent } from './components/wz-form/components/wz-input-tags/wz-input-tags.component';
import { WzInputSuggestionsComponent } from './components/wz-form/components/wz-input-suggestions/wz-input-suggestions.component';
import { CollectionFormComponent } from '../application/collection-tray/components/collection-form.component';
import { WzSortComponent } from './components/wz-sort/wz.sort.component';
import { CollectionLinkComponent } from '../+collection/components/collection-link.component';
import { EqualValidatorDirective } from './components/wz-form/wz-validators/wz-equal-validator.directive';
import { WzSelectComponent } from './components/wz-select/wz.select.component';
import { WzTermsComponent } from './components/wz-terms/wz.terms.component';
import { WzSpeedviewComponent, WzSpeedviewPortalDirective } from './components/wz-speedview/wz.speedview.component';
import { WzSpeedviewDirective } from './components/wz-speedview/wz.speedview.directive';
import { WzPricingComponent } from './components/wz-pricing/wz.pricing.component';
import { WzAutocompleteSearchComponent } from './components/wz-autocomplete-search/wz-autocomplete-search.component';

// Shared pipes
import { ValuesPipe } from './pipes/values.pipe';
import { TimecodePipe } from './pipes/timecode.pipe';

// Shared resolvers
import { AssetResolver } from '../+asset/services/asset.resolver';
import { SearchResolver } from '../+search/services/search.resolver';
import { CartResolver } from '../+commerce/+cart/services/cart.resolver';
import { OrderResolver } from '../+commerce/+order/services/order.resolver';
import { OrdersResolver } from '../+commerce/+order/services/orders.resolver';
import { WAZEE_PROVIDERS } from '../imports/wazee';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, 'https://', '.json'),
      deps: [Http]
    }),
    HttpModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
  ],
  declarations: [
    WzAssetListComponent,
    WzBreadcrumbComponent,
    WzDialogComponent,
    WzDropdownComponent,
    WzFormComponent,
    WzListComponent,
    WzPaginationComponent,
    WzPikaDayDirective,
    WzPlayerComponent,
    WzAdvancedPlayerComponent,
    WzSubclipControlbarComponent,
    WzPlayerControlbarComponent,
    WzPlaybackToggleButtonComponent,
    WzTimeDisplayComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    WzItemSearchFormComponent,
    ValuesPipe,
    TimecodePipe,
    WzDialogPortalDirective,
    WzDropdownPortalDirective,
    WzInputTagsComponent,
    WzInputSuggestionsComponent,
    CollectionFormComponent,
    WzNotificationComponent,
    WzSortComponent,
    CollectionLinkComponent,
    EqualValidatorDirective,
    WzSelectComponent,
    WzClipBoardDirective,
    WzTermsComponent,
    WzSpeedviewComponent,
    WzSpeedviewDirective,
    WzSpeedviewPortalDirective,
    WzPricingComponent,
    WzAutocompleteSearchComponent
  ],
  exports: [
    WzAssetListComponent,
    WzBreadcrumbComponent,
    WzDialogComponent,
    WzDropdownComponent,
    WzFormComponent,
    WzListComponent,
    WzPaginationComponent,
    WzPikaDayDirective,
    WzPlayerComponent,
    WzAdvancedPlayerComponent,
    WzSubclipControlbarComponent,
    WzPlayerControlbarComponent,
    WzPlaybackToggleButtonComponent,
    WzTimeDisplayComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    WzItemSearchFormComponent,
    ValuesPipe,
    TimecodePipe,
    WzDialogPortalDirective,
    WzDropdownPortalDirective,
    WzInputTagsComponent,
    WzInputSuggestionsComponent,
    CollectionFormComponent,
    CommonModule,
    RouterModule,
    TranslateModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    WzNotificationComponent,
    WzSortComponent,
    CollectionLinkComponent,
    EqualValidatorDirective,
    WzSelectComponent,
    WzClipBoardDirective,
    WzTermsComponent,
    WzSpeedviewComponent,
    WzSpeedviewDirective,
    WzSpeedviewPortalDirective,
    WzPricingComponent,
    WzAutocompleteSearchComponent
  ],
  entryComponents: [
    WzNotificationComponent,
    CollectionLinkComponent,
    CollectionFormComponent,
    WzTermsComponent,
    WzPricingComponent]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        TranslateService,
        AssetResolver,
        SearchResolver,
        CartResolver,
        OrderResolver,
        OrdersResolver,
        WAZEE_PROVIDERS]
    };
  }
}
