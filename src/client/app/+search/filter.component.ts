import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SearchComponent } from './search.component';
import { DateRangeKey, DateRange } from '../shared/utilities/dateRange';

interface DateRangeElement {
  name: DateRangeKey;
  value: string;
  event: string;
};

@Component({
  moduleId: module.id,
  selector: 'filter-component',
  templateUrl: 'filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterComponent {
  @Input() filters: any;
  @Input() counted: boolean;
  public dateRange: DateRange;

  constructor(private searchComponent: SearchComponent) {
    this.dateRange = new DateRange();
  }

  public filterShouldBeShowing(filter: any): boolean {
    let filterState: any = JSON.parse(localStorage.getItem('filterState'));
    if (filterState) {
      return filterState[filter.name];
    } else {
      return filter.active;
    }
  }

  public toggle(filter: any): void {
    let filterState = JSON.parse(localStorage.getItem('filterState'));
    if (filterState) {
      filterState[filter.name] = !filterState[filter.name];
      localStorage.setItem('filterState', JSON.stringify(filterState));
    } else {
      this.searchComponent.toggleFilter(filter.filterId);
    }
  }

  public applyFilter(filterId: number): void {
    this.searchComponent.applyFilter(filterId);
  }

  public applyExclusiveFilter(subFilter: any): void {
    this.searchComponent.applyExclusiveFilter(subFilter);
  }

  public hasActiveChildren(filter: any): boolean {
    if (filter.subFilters) {
      return filter.subFilters.filter((f: any) => f.active).length > 0;
    } else {
      return false;
    }
  }

  public hasCounts(filter: any): boolean {
    var hasCounts: boolean = true;
    if (filter.subFilters) {
      hasCounts = filter.subFilters.filter((f: any) => {
        return f.count > 0;
      }).length > 0;
    } else {
      hasCounts = filter.count !== 0;
    }
    return hasCounts;
  }

  public isHeadingFilter(count: number): boolean {
    return count === -1;
  }

  public customValue(event: any, filter: any) {
    if (event.code === 'Enter') {
      this.searchComponent.applyCustomValue(filter, event.target.value);
    }
  }

  public dateRangeSelect(event: any, filter: any): void {
    const element: DateRangeElement = event.target;

    this.dateRange.set(element.name, element.value);
    element.event = this.dateRange.get(element.name);

    this.searchComponent.applyCustomValue(filter, this.dateRange.toString());
  }

  public defaultDate(filter: any, key: DateRangeKey): string {
    if (filter && filter.filterValue) {
      this.dateRange.set(key, filter.filterValue);
    }

    return this.dateRange.get(key);
  }
}
