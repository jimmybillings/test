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
import { AppResolver } from './app.resolver';

@NgModule({
  imports: [
    BrowserModule,
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
    StoreModule.provideStore(WAZEE_STORES)
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>',
  },
  {
    provide: Window,
    useValue: window
  },
    AppResolver],
  declarations: [AppComponent, NotFoundComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
