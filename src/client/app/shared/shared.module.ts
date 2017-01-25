// Shared Angular Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService, TranslateParser } from 'ng2-translate';
import { MaterialModule } from '@angular/material';

// Shared Wazee Modules
import { WzPlayerModule } from './modules/wz-player/wz.player.module';
import { WzFormModule } from './modules/wz-form/wz-form.module';

// Shared Pure Components
import { WzNotificationComponent } from './components/wz-notification/wz.notification.component';
import { WzAssetGridComponent } from './components/wz-asset/wz-asset-grid/wz.asset-grid.component';
import { WzAssetListComponent } from './components/wz-asset/wz-asset-list/wz.asset-list.component';
import { WzBreadcrumbComponent } from './components/wz-breadcrumb/wz.breadcrumb.component';
import { WzDropdownComponent, WzDropdownPortalDirective } from './components/wz-dropdown/wz.dropdown.component';
import { WzListComponent } from './components/wz-list/wz.list.component';
import { WzPaginationComponent } from './components/wz-pagination/wz.pagination.component';
import { WzPikaDayDirective } from './components/wz-pikaday/wz-pikaday.directive';
import { WzClipBoardDirective } from './components/wz-clipboard/wz-clipboard.directive';
import { CollectionSortDdComponent } from '../+collection/components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from '../+collection/components/collections-filter-dd.component';
import { WzItemSearchFormComponent } from './components/wz-item-search-form/wz.item-search-form.component';
import { CollectionFormComponent } from '../application/collection-tray/components/collection-form.component';
import { WzSortComponent } from './components/wz-sort/wz.sort.component';
import { CollectionLinkComponent } from '../+collection/components/collection-link.component';
import { WzSelectComponent } from './components/wz-select/wz.select.component';
import { WzTermsComponent } from './components/wz-terms/wz.terms.component';
import { WzSpeedviewComponent, WzSpeedviewPortalDirective } from './components/wz-asset/wz-speedview/wz.speedview.component';
import { WzSpeedviewDirective } from './components/wz-asset/wz-speedview/wz.speedview.directive';
import { WzPricingComponent } from './components/wz-pricing/wz.pricing.component';
import { WzComingSoonComponent } from './components/wz-coming-soon/wz-coming-soon.component';

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
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, 'https://', '.json'),
      deps: [Http]
    }),
    HttpModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    WzPlayerModule,
    WzFormModule
  ],
  declarations: [
    WzAssetGridComponent,
    WzAssetListComponent,
    WzBreadcrumbComponent,
    WzDropdownComponent,
    WzListComponent,
    WzPaginationComponent,
    WzPikaDayDirective,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    WzItemSearchFormComponent,
    ValuesPipe,
    WzDropdownPortalDirective,
    CollectionFormComponent,
    WzNotificationComponent,
    WzSortComponent,
    CollectionLinkComponent,
    WzSelectComponent,
    WzClipBoardDirective,
    WzTermsComponent,
    WzSpeedviewComponent,
    WzSpeedviewDirective,
    WzSpeedviewPortalDirective,
    WzPricingComponent,
    WzComingSoonComponent
  ],
  exports: [
    WzAssetGridComponent,
    WzAssetListComponent,
    WzBreadcrumbComponent,
    WzDropdownComponent,
    WzListComponent,
    WzPaginationComponent,
    WzPikaDayDirective,
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
    WzNotificationComponent,
    WzSortComponent,
    CollectionLinkComponent,
    WzSelectComponent,
    WzClipBoardDirective,
    WzTermsComponent,
    WzSpeedviewComponent,
    WzSpeedviewDirective,
    WzSpeedviewPortalDirective,
    WzPricingComponent,
    WzComingSoonComponent,
    WzFormModule
  ],
  entryComponents: [
    WzNotificationComponent,
    CollectionLinkComponent,
    CollectionFormComponent,
    WzTermsComponent,
    WzPricingComponent,
    WzComingSoonComponent]
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
