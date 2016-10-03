import { NgModule } from '@angular/core';
import { AssetComponent } from './asset.component';
import { SharedModule } from '../shared/shared.module';
import { AssetDetailComponent } from './components/asset-detail.component';
import { AssetDataComponent } from './components/asset-data.component';
import { AssetShareComponent } from './components/asset-share.component';
import { AssetShareLinkComponent } from './components/asset-share-link.component';


@NgModule({
    imports: [SharedModule],
    declarations: [AssetComponent, AssetDetailComponent, AssetDataComponent, AssetShareComponent, AssetShareLinkComponent],
    exports: [AssetComponent],
})

export class AssetModule { }
