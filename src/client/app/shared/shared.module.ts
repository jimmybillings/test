// Shared Angular Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate/ng2-translate';

// Shared Pure Components
import { WzNotificationComponent } from '../shared/components/wz-notification/wz.notification.component';
import { WzSearchBoxComponent } from '../shared/components/wz-search-box/wz.search-box.component';
import { WzAssetListComponent } from '../shared/components/wz-asset-list/wz.asset-list.component';
import { WzBreadcrumbComponent } from '../shared/components/wz-breadcrumb/wz.breadcrumb.component';
import { WzDialogComponent, WzDialogPortalDirective } from '../shared/components/wz-dialog/wz.dialog.component';
import { WzDropdownComponent, WzDropdownPortalDirective } from '../shared/components/wz-dropdown/wz.dropdown.component';
import { WzFormComponent } from '../shared/components/wz-form/wz.form.component';
import { WzListComponent } from '../shared/components/wz-list/wz.list.component';
import { WzPaginationComponent } from '../shared/components/wz-pagination/wz.pagination.component';
import { WzPikaDayDirective } from '../shared/components/wz-pikaday/wz-pikaday.directive';
import { WzPlayerComponent } from '../shared/components/wz-player/wz.player.component';
import { WzToastComponent, WzToastPortalDirective } from '../shared/components/wz-toast/wz.toast.component';
import { CollectionSortDdComponent } from '../+collection/components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from '../+collection/components/collections-filter-dd.component';
import { CollectionsSearchFormComponent } from '../+collection/components/collections-search-form.component';
import { WzInputTagsComponent } from '../shared/components/wz-input-tags/wz-input-tags.component';
import { WzInputSuggestionsComponent } from '../shared/components/wz-input-suggestions/wz-input-suggestions.component';
import { CollectionFormComponent } from '../application/collection-tray/components/collection-form.component';

// Shared pipes
import { ValuesPipe } from '../shared/pipes/values.pipe';

// Shared resolvers
import { AssetResolver } from '../+asset/services/asset.resolver';
import { SearchResolver } from '../+search/services/search.resolver';
import { WAZEE_PROVIDERS } from '../imports/wazee';

import { MaterialModule } from './material.module';

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
    // WzNotificationComponent,
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
    CollectionsSearchFormComponent,
    ValuesPipe,
    WzDialogPortalDirective,
    WzDropdownPortalDirective,
    WzToastPortalDirective,
    WzInputTagsComponent,
    WzInputSuggestionsComponent,
    CollectionFormComponent,
    WzNotificationComponent
  ],
  exports: [
    // WzNotificationComponent,
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
    CollectionsSearchFormComponent,
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
    WzNotificationComponent],
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
        WAZEE_PROVIDERS]
    };
  }
}
