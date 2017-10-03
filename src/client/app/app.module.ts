import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { HomeModule } from './+home/home.module';
import { UserManagementModule } from './+user-management/user-management.module';
import { SearchModule } from './+search/search.module';
import { AssetModule } from './+asset/asset.module';
import { CollectionModule } from './+collection/collection.module';
import { ApplicationModule } from './application/application.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { CommerceModule } from './+commerce/commerce.module';
import { GalleryViewModule } from './+gallery-view/gallery-view.module';

import { CurrentUserService } from './shared/services/current-user.service';
import { ApiConfig } from './shared/services/api.config';
import { UiConfig } from './shared/services/ui.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_ROUTES } from './app.routes';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(APP_ROUTES, { initialNavigation: false }),
    SharedModule.forRoot(),
    HomeModule,
    SearchModule,
    AssetModule,
    CollectionModule,
    UserManagementModule,
    CommerceModule,
    ApplicationModule,
    GalleryViewModule,
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>',
  }],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private uiConfig: UiConfig,
    private apiConfig: ApiConfig,
    private currentUser: CurrentUserService) {
    let attrs = document.querySelector('wazee-digital-platform').attributes;
    Object.keys(attrs).forEach((key: any) => {
      switch (attrs[key].name) {
        case 'portal':
          apiConfig.portal = localStorage.getItem('currentSite') || attrs[key].value;
          break;
        case 'baseurl':
          apiConfig.baseUrl = attrs[key].value;
          break;
      }
    });
    currentUser.set();
    uiConfig.initialize(apiConfig.portal);
  }
}
