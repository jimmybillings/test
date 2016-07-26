import { Component, Input, Inject, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from './services/filter.service';
import { SearchComponent } from './search.component';

@Component({
  moduleId: module.id,
  selector: 'filter',
  templateUrl: 'filter.html',
  providers: [FilterService],
  directives: [FilterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterComponent {
  @Input() filters: any;
  public searchComponent: SearchComponent;
  public currentFilter: any;
  constructor(
    public filterService: FilterService,
    @Inject(forwardRef(() => SearchComponent)) searchComponent:SearchComponent) {
      this.searchComponent = searchComponent;
      this.currentFilter = [];
    }


  public selected(filterName: any) {
    return this.currentFilter[filterName] === filterName;
  }

  public filterAction(filter: any) {
    if (filter.expanded) {
      this.toggleFilters(filter);
    } else {
      this.applyFilter(filter);
    }
  }

  public toggleFilters(filter: any): void {
    this.currentFilter[filter.name] = (this.currentFilter[filter.name] === filter.name) ? false : filter.name;
  }

  public applyFilter(filter: any): void {
    this.searchComponent.applyFilter(filter);
  }

  public hasCounts(filter:any) {
    var hasCounts:boolean = true;
    if (filter.subFilters) {
      hasCounts = filter.subFilters.filter((f: any) => {
        return f.count > 0;
      }).length > 0;
    } else {
      hasCounts = filter.count !== 0;
    }
    return hasCounts;
  }
}
