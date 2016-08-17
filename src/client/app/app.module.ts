import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { APP_ROUTES } from './app.routes';

import { AssetResolver } from './+asset/services/asset.resolver';
import { SearchResolver } from './+search/services/search.resolver';
import { CollectionShowResolver } from './+collection/services/collection-show.resolver';

import { PROVIDERS, STORES } from './imports/index';

@NgModule({
     declarations: [AppComponent],
     imports: [
         BrowserModule,
         FormsModule,
         RouterModule.forRoot(APP_ROUTES),
     ],
     providers: [
      {provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'},
      AssetResolver,
      SearchResolver,
      CollectionShowResolver,
      ...PROVIDERS,
      ...STORES
    ],
     bootstrap: [AppComponent],
 })
 export class AppModule {}
