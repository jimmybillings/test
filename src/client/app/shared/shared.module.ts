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
import { CollectionListDdComponent } from '../+collection/components/collections-list-dd.component';
import { CollectionFormComponent } from '../+collection/components/collection-form.component';
import { CollectionSortDdComponent } from '../+collection/components/collections-sort-dd.component';
import { CollectionFilterDdComponent } from '../+collection/components/collections-filter-dd.component';
import { CollectionsSearchFormComponent } from '../+collection/components/collections-search-form.component';
// Shared pipes
import { ValuesPipe } from '../shared/pipes/values.pipe';

// Shared resolvers
import { AssetResolver } from '../+asset/services/asset.resolver';
import { SearchResolver } from '../+search/services/search.resolver';
import { CollectionShowResolver } from '../+collection/services/collection-show.resolver';
import { WAZEE_PROVIDERS, WAZEE_STORES } from '../imports/wazee';

// Material Modules
import { MdButtonModule } from '@angular2-material/button';
import { MdCardModule } from '@angular2-material/card';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { MdInputModule } from '@angular2-material/input';
import { MdListModule } from '@angular2-material/list';
import { MdMenuModule } from '@angular2-material/menu';
import { MdProgressBarModule } from '@angular2-material/progress-bar';
import { MdProgressCircleModule } from '@angular2-material/progress-circle';
import { MdRadioModule } from '@angular2-material/radio';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { MdSlideToggleModule } from '@angular2-material/slide-toggle';
import { MdTabsModule } from '@angular2-material/tabs';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdSliderModule } from '@angular2-material/slider';
import { MdIconModule} from '@angular2-material/icon';
import { MdTooltipModule} from '@angular2-material/tooltip';
import { MdCoreModule} from '@angular2-material/core';
import { MdGridListModule} from '@angular2-material/grid-list';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    HttpModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdProgressCircleModule,
    MdRadioModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdTabsModule,
    MdToolbarModule,
    MdSliderModule,
    MdIconModule,
    MdTooltipModule,
    MdCoreModule,
    MdGridListModule],
  declarations: [
    WzNotificationComponent,
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
    CollectionListDdComponent,
    CollectionFormComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    CollectionsSearchFormComponent,
    ValuesPipe,
    WzDialogPortalDirective,
    WzDropdownPortalDirective,
    WzToastPortalDirective
  ],
  exports: [
    WzNotificationComponent,
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
    CollectionListDdComponent,
    CollectionFormComponent,
    CollectionSortDdComponent,
    CollectionFilterDdComponent,
    CollectionsSearchFormComponent,
    CommonModule,
    RouterModule,
    TranslateModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdProgressCircleModule,
    MdRadioModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdTabsModule,
    MdToolbarModule,
    MdSliderModule,
    MdIconModule,
    MdTooltipModule,
    MdCoreModule,
    MdGridListModule,
    ValuesPipe,
    WzDialogPortalDirective,
    WzDropdownPortalDirective,
    WzToastPortalDirective]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [{
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
        deps: [Http]
      },
        TranslateService,
        AssetResolver,
        SearchResolver,
        CollectionShowResolver,
        WAZEE_PROVIDERS, WAZEE_STORES]
    };
  }
}
