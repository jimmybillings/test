import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SharedModule } from '../shared/shared.module';
import { FilterComponent } from './filter.component';

@NgModule({
    imports: [SharedModule],
    declarations: [SearchComponent, FilterComponent],
    exports: [SearchComponent],
})

export class SearchModule { }