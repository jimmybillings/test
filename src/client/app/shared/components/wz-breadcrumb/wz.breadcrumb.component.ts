import { Component, Input, Output, EventEmitter, Inject, forwardRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { DateRange } from '../../utilities/dateRange';

@Component({
  moduleId: module.id,
  selector: 'breadcrumb-component',
  templateUrl: 'wz.breadcrumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzBreadcrumbComponent implements OnChanges {
  @Input() filters: any;
  @Output() apply = new EventEmitter();
  @Output() clear = new EventEmitter();
  public activeFilters: any = [];

  public clearFilter(filter: any) {
    this.apply.emit(filter.filterId);
  }

  ngOnChanges(changes: any) {
    if (changes.filters && changes.filters.currentValue) {
      this.activeFilters = [];
      this.getFilters(this.filters);
    }
  }

  public clearFilters() {
    this.clear.emit();
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
