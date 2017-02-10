import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SharedModule } from '../shared/shared.module';
import { FilterComponent } from './filter.component';
import { NoResultsComponent } from './no-results.component';
import { SearchHeaderComponent } from './search-header.component';
@NgModule({
    imports: [SharedModule],
    declarations: [SearchComponent, FilterComponent, NoResultsComponent, SearchHeaderComponent],
    exports: [SearchComponent]
})

export class SearchModule { }
