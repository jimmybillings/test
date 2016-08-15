import { Component, Input, Inject, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SearchComponent } from './search.component';
import { WzPikaDayDirective } from '../shared/components/wz-pikaday/wz-pikaday.directive';

@Component({
  moduleId: module.id,
  selector: 'filter',
  templateUrl: 'filter.html',
  directives: [FilterComponent, WzPikaDayDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterComponent {
  @Input() filters: any;
  public searchComponent: SearchComponent;
  public dateRange: any;

  constructor(
    @Inject(forwardRef(() => SearchComponent)) searchComponent: SearchComponent, private change: ChangeDetectorRef) {
    this.searchComponent = searchComponent;
    this.dateRange = {};
    
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

  public dateRangeSelect(event: any, filter: any) {
    event.target.event = this.serverDate(event.target.value);
    this.dateRange[event.target.name] = event.target.event;
    if (Object.keys(this.dateRange).filter((date) => this.dateRange[date]).length === 2) {
      this.searchComponent.applyCustomValue(filter, this.serverDate(this.dateRange.start) + ' - ' + this.serverDate(this.dateRange.end));
    }
  }

  public defaultDate(filter: any, state: any) {
    switch (state) {
      case 'start':
        return this.dateRange[state] = (filter.filterValue) ? this.serverDate(filter.filterValue.split(' - ')[0]) : this.dateRange[state] || null;
      case 'end':
        return this.dateRange[state] = (filter.filterValue) ? this.serverDate(filter.filterValue.split(' - ')[1]) : this.dateRange[state] || null;
    }
  }

  public serverDate(date: any) {
    return new Date(date).toJSON().slice(0, 10);
  }

  public clientDate(date: any) {
    let d: any = new Date(date).toJSON().slice(0, 10).split('-');
    return d[1] + '-' + d[2] + '-' + d[0];
  }
}
