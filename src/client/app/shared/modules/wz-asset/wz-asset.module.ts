import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { TranslateModule } from 'ng2-translate';
import { RouterModule } from '@angular/router';

import { WzAssetGridComponent } from './wz-asset-grid/wz.asset-grid.component';
import { WzAssetListComponent } from './wz-asset-list/wz.asset-list.component';
import { WzSpeedviewComponent, WzSpeedviewPortalDirective } from './wz-speedview/wz.speedview.component';
import { WzSpeedviewDirective } from './wz-speedview/wz.speedview.directive';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    RouterModule
  ],
  declarations: [
    WzAssetGridComponent,
    WzAssetListComponent,
    WzSpeedviewComponent,
    WzSpeedviewDirective,
    WzSpeedviewPortalDirective
  ],
  exports: [
    WzSpeedviewComponent,
    WzAssetGridComponent,
    WzAssetListComponent
  ],
})
export class WzAssetModule { }
