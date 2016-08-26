import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { APP_ROUTES } from './app.routes';

import { HomeModule } from './+home/home.module';
import { UserManagementModule } from './+user-management/user-management.module';
import { ContentModule } from './+content/content.module';
import { SearchModule } from './+search/search.module';
import { AssetModule } from './+asset/asset.module';
import { AdminModule } from './+admin/admin.module';
import { CartModule } from './+cart/cart.module';
import { CollectionModule } from './+collection/collection.module';
import { ApplicationModule } from './application/application.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    SharedModule,
    HomeModule,
    SearchModule,
    AssetModule,
    CollectionModule,
    ContentModule,
    UserManagementModule,
    AdminModule,
    CartModule,
    ApplicationModule
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
