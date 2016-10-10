import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SharedModule } from '../shared/shared.module';
import { FilterComponent } from './filter.component';
import { AssetData } from './services/asset.data.service';
import { FilterService } from './services/filter.service';

@NgModule({
    imports: [SharedModule],
    declarations: [SearchComponent, FilterComponent],
    exports: [SearchComponent],
    providers: [AssetData, FilterService]
})

export class SearchModule { }
