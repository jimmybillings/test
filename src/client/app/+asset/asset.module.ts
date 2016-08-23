import { NgModule } from '@angular/core';
import { AssetComponent } from './asset.component';
import { SharedModule } from '../shared/shared.module';
import { AssetDetailComponent } from './components/asset-detail.component';
import { AssetDataComponent } from './components/asset-data.component';
@NgModule({
    imports: [SharedModule],
    declarations: [AssetComponent, AssetDetailComponent, AssetDataComponent],
    exports: [AssetComponent],
})

export class AssetModule { }
