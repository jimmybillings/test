// Shared Angular Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate/ng2-translate';
import { MaterialModule } from '@angular/material';

// Shared Pure Components
import { WzNotificationComponent } from './components/wz-notification/wz.notification.component';
import { WzSearchBoxComponent } from './components/wz-search-box/wz.search-box.component';
import { WzAssetListComponent } from './components/wz-asset-list/wz.asset-list.component';
import { WzBreadcrumbComponent } from './components/wz-breadcrumb/wz.breadcrumb.component';
import { WzDialogComponent, WzDialogPortalDirective } from './components/wz-dialog/wz.dialog.component';
import { WzDropdownComponent, WzDropdownPortalDirective } from './components/wz-dropdown/wz.dropdown.component';
import { WzFormComponent } from './components/wz-form/wz.form.component';
import { WzListComponent } from './components/wz-list/wz.list.component';
import { WzPaginationComponent } from './components/wz-pagination/wz.pagination.component';
import { WzPikaDayDirective } from './components/wz-pikaday/wz-pikaday.directive';
import { WzClipBoardDirective } from './components/wz-clipboard/wz-clipboard.directive';
import { WzPlayerComponent } from './components/wz-player/wz.player.component';
import { WzToastComponent, WzToastPortalDirective } from './components/wz-toast/wz.toast.component';
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

// Shared pipes
  import { ValuesPipe } from './pipes/values.pipe';

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
    TranslateModule,
    HttpModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
  ],
  declarations: [
    WzSearchBoxComponent,
    WzAssetListComponent,
    WzBreadcrumbComponent,
    WzDialogComponent,
    WzDropdownComponent,
    WzFormComponent,
    WzListComponent,
    WzPaginationComponent,
    WzPikaDayDirective,
    WzPlayerComponent,
    WzToastComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    WzItemSearchFormComponent,
    ValuesPipe,
    WzDialogPortalDirective,
    WzDropdownPortalDirective,
    WzToastPortalDirective,
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
    WzPricingComponent
  ],
  exports: [
    WzSearchBoxComponent,
    WzAssetListComponent,
    WzBreadcrumbComponent,
    WzDialogComponent,
    WzDropdownComponent,
    WzFormComponent,
    WzListComponent,
    WzPaginationComponent,
    WzPikaDayDirective,
    WzPlayerComponent,
    WzToastComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    WzItemSearchFormComponent,
    ValuesPipe,
    WzDialogPortalDirective,
    WzDropdownPortalDirective,
    WzToastPortalDirective,
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
    WzPricingComponent
  ],
  entryComponents: [WzNotificationComponent]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: TranslateLoader,
          useFactory: (http: Http) => new TranslateStaticLoader(http, 'https://', '.json'),
          deps: [Http]
        },
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