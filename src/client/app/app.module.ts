import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { APP_ROUTES } from './app.routes';

import { HomeModule } from './+home/home.module';
import { UserManagementModule } from './+user-management/user-management.module';
import { SearchModule } from './+search/search.module';
import { AssetModule } from './+asset/asset.module';
import { AdminModule } from './+admin/admin.module';
import { CollectionModule } from './+collection/collection.module';
import { ApplicationModule } from './application/application.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { WAZEE_STORES } from './imports/wazee';
import { CommerceModule } from './+commerce/commerce.module';
import { NotFoundComponent } from './app.not-found.component';
import { GalleryViewModule } from './+gallery-view/gallery-view.module';

import { CurrentUserService } from './shared/services/current-user.service';
import { ApiConfig } from './shared/services/api.config';
import { UiConfig } from './shared/services/ui.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
declare var portal: string;

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(APP_ROUTES),
    SharedModule.forRoot(),
    HomeModule,
    SearchModule,
    AssetModule,
    CollectionModule,
    UserManagementModule,
    AdminModule,
    CommerceModule,
    ApplicationModule,
    GalleryViewModule,
    StoreModule.provideStore(WAZEE_STORES)
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>',
  }],
  declarations: [AppComponent, NotFoundComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private uiConfig: UiConfig,
    private apiConfig: ApiConfig,
    private currentUser: CurrentUserService) {
    this.apiConfig.setPortal(portal);
    this.currentUser.set();
    this.uiConfig.initialize(this.apiConfig.getPortal());
  }
}
