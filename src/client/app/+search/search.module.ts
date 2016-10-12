import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SharedModule } from '../shared/shared.module';
import { FilterComponent } from './filter.component';
import { AssetData } from './services/asset.data.service';

@NgModule({
    imports: [SharedModule],
    declarations: [SearchComponent, FilterComponent],
    exports: [SearchComponent],
    providers: [AssetData]
})

export class SearchModule { }
