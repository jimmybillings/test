import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { DateRangeKey, DateRange } from '../shared/utilities/dateRange';

@Component({
  moduleId: module.id,
  selector: 'filter-component',
  templateUrl: 'filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterComponent {
  @Input() filters: any;
  @Input() counted: boolean;
  @Output() onFilterEvent: any = new EventEmitter();
  public dateRange: DateRange = new DateRange();

  public toggleFilterGroup(filter: any): void {
    this.onFilterEvent.emit({
      event: 'toggleFilterGroup',
      filter: filter
    });
  }

  public toggleFilter(filter: any): void {
    this.onFilterEvent.emit({
      event: 'toggleFilter',
      filter: filter
    });
  }

  public applyExclusiveFilter(filter: any): void {
    this.onFilterEvent.emit({
      event: 'applyExclusiveFilter',
      filter: filter
    });
  }

  public applyCustomValue(event: any, filter: any) {
    if (event.code === 'Enter') {
      this.onFilterEvent.emit({
        event: 'applyCustomValue',
        filter: filter,
        customValue: event.target.value
      });
    }
  }

  public applyDateRange(event: any, filter: any): void {
    this.dateRange.set(event.target.name, event.target.value);
    event.target.event = this.dateRange.get(event.target.name);
    this.onFilterEvent.emit({
      event: 'applyCustomValue',
      filter: filter,
      customValue: this.dateRange.toString()
    });
  }

  public defaultDate(filter: any, key: DateRangeKey): string {
    if (filter && filter.filterValue) this.dateRange.set(key, filter.filterValue);
    return this.dateRange.get(key);
  }
}
