import { Component, Input, Inject, forwardRef } from '@angular/core';
import { FilterService } from './services/filter.service';
import { SearchComponent } from './search.component';

@Component({
  moduleId: module.id,
  selector: 'filter',
  templateUrl: 'filter.html',
  providers: [FilterService],
  directives: [FilterComponent]
})

export class FilterComponent {
  @Input() filters: any;
  public searchComponent: SearchComponent;

  constructor(
    public filterService: FilterService,
    @Inject(forwardRef(() => SearchComponent)) searchComponent:SearchComponent) {
      this.searchComponent = searchComponent;
    }

  public toggleFilters(filter: any): void {
    filter.subFilters.map((filter: any) => {
      filter.expanded = !filter.expanded;
      return filter;
    });
  }

  public applyFilter(filter: any): void {
    this.searchComponent.applyFilter(filter);
  }
}
