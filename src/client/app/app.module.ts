import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { APP_ROUTES } from './app.routes';

import { AppNavComponent } from './application/app-nav/app-nav.component';
import { FooterComponent } from './application/footer/footer.component';
import { BinTrayComponent } from './application/bin-tray/bin-tray.component';

import { HomeModule } from './+home/home.module';
import { UserManagementModule } from './+user-management/user-management.module';
import { ContentModule } from './+content/content.module';
import { SearchModule } from './+search/search.module';
import { AssetModule } from './+asset/asset.module';
import { AdminModule } from './+admin/admin.module';
import { CollectionModule } from './+collection/collection.module';

import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';

@NgModule({
     imports: [
          BrowserModule,
          RouterModule.forRoot(APP_ROUTES),
          SharedModule.forRoot(),
          HomeModule,
          SearchModule,
          AssetModule,
          CollectionModule,
          ContentModule,
          UserManagementModule,
          AdminModule
     ],
     providers: [{
        provide: APP_BASE_HREF,
        useValue: '<%= APP_BASE %>'
      }
    ],
    declarations: [AppComponent, AppNavComponent, FooterComponent, BinTrayComponent],
    bootstrap: [AppComponent],
 })
 export class AppModule {}
