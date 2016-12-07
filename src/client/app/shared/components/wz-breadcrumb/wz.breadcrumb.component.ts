import { Component, Input, Output, EventEmitter, Inject, forwardRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { SearchComponent } from '../../../+search/search.component';
import { DateRange } from '../../utilities/dateRange';

@Component({
  moduleId: module.id,
  selector: 'breadcrumb-component',
  templateUrl: 'wz.breadcrumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzBreadcrumbComponent implements OnChanges {
  @Input() filters: any;
  @Input() loading: boolean;
  @Output() apply = new EventEmitter();
  @Output() clear = new EventEmitter();
  public searchComponent: SearchComponent;
  public activeFilters: any;


  constructor( @Inject(forwardRef(() => SearchComponent)) searchComponent: SearchComponent) {
    this.searchComponent = searchComponent;
    this.activeFilters = [];
  }

  public clearFilter(filter: any) {
    this.searchComponent.applyFilter(filter.filterId);
  }

  ngOnChanges(changes: any) {
    if (changes.filters && changes.filters.currentValue) {
      this.activeFilters = [];
      this.getFilters(this.filters);
    }
  }

  public clearFilters() {
    this.searchComponent.clearFilters();
  }

  public formattedValueFor(filter: any): string {
    if (filter.type === 'DateRange') {
      const dateRange: DateRange = new DateRange();
      dateRange.set('start', filter.filterValue);
      dateRange.set('end', filter.filterValue);
      return dateRange.toHumanString();
    }

    return filter.filterValue;
  }

  private getFilters(filter: any) {
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.getFilters(l);
      return filter;
    } else {
      if (filter.active) this.activeFilters.push(filter);
      return filter;
    }
  }
}
