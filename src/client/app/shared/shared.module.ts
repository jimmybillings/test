// Shared Angular Modules
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { MaterialModule } from '@angular/material';

// WAZEE PROVIDERS
import { WAZEE_PROVIDERS } from '../imports/wazee';

// Shared Wazee Modules
import { WzPlayerModule } from './modules/wz-player/wz.player.module';
import { WzFormModule } from './modules/wz-form/wz-form.module';
import { WzAssetModule } from './modules/wz-asset/wz-asset.module';
import { WzDialogModule } from './modules/wz-dialog/wz.dialog.module';

// Shared Pure Components
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
import { WzTermsComponent } from './components/wz-terms/wz.terms.component';
import { WzPricingComponent } from './components/wz-pricing/wz.pricing.component';
import { WzComingSoonComponent } from './components/wz-coming-soon/wz-coming-soon.component';
import { WzSubclipEditorComponent } from './components/wz-subclip-editor/wz.subclip-editor.component';
import { WzGalleryTwoLevelComponent } from './components/wz-gallery-two-level/wz.gallery-two-level.component';
import { WzGalleryBreadcrumbComponent } from './components/wz-gallery-breadcrumb/wz.gallery-breadcrumb.component';

// Shared pipes
import { ValuesPipe } from './pipes/values.pipe';


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
    WzFormModule,
    WzAssetModule,
    WzDialogModule
  ],
  declarations: [
    WzGalleryBreadcrumbComponent,
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
    WzSortComponent,
    CollectionLinkComponent,
    WzClipBoardDirective,
    WzTermsComponent,
    WzPricingComponent,
    WzComingSoonComponent,
    WzGalleryTwoLevelComponent,
    WzSubclipEditorComponent
  ],
  exports: [
    WzGalleryBreadcrumbComponent,
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
    WzDialogModule
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
      providers: WAZEE_PROVIDERS
    };
  }
}
