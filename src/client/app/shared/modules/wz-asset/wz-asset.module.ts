import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { WzPlayerModule } from '../wz-player/wz.player.module';

import { WzAssetGridComponent } from './wz-asset-grid/wz.asset-grid.component';
import { WzAssetListComponent } from './wz-asset-list/wz.asset-list.component';
import { WzSpeedviewComponent, WzSpeedviewPortalDirective } from './wz-speedview/wz.speedview.component';
import { WzSpeedviewDirective } from './wz-speedview/wz.speedview.directive';
import { WzAsperaDownloadDirective } from '../../components/wz-aspera-download/aspera-download.directive';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    RouterModule,
    WzPlayerModule
  ],
  declarations: [
    WzAssetGridComponent,
    WzAssetListComponent,
    WzSpeedviewComponent,
    WzSpeedviewDirective,
    WzSpeedviewPortalDirective,
    WzAsperaDownloadDirective
  ],
  exports: [
    WzSpeedviewComponent,
    WzAssetGridComponent,
    WzAssetListComponent,
    WzAsperaDownloadDirective

  ],
})
export class WzAssetModule { }
