import { Component, Input, Inject, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { SearchComponent } from './search.component';
import { DatePicker } from 'ng2-datepicker/ng2-datepicker';
import { FORM_DIRECTIVES } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'filter',
  templateUrl: 'filter.html',
  directives: [FilterComponent, DatePicker, FORM_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterComponent {
  @Input() filters: any;
  public searchComponent: SearchComponent;
  public currentFilters: any;
  public exclusiveFilters: any;
  constructor(
    @Inject(forwardRef(() => SearchComponent)) searchComponent:SearchComponent) {
      this.searchComponent = searchComponent;
      this.currentFilters = {};
      this.exclusiveFilters = {};
    }

  public selected(filterName: any) {
    return this.currentFilters[filterName] === filterName;
  }

  public filterAction(filter: any) {
    (filter.expanded) ? this.toggleFilters(filter) : this.applyFilter(filter.filterId);
  }

  public toggleFilters(filter: any): void {
    this.currentFilters[filter.name] = (this.currentFilters[filter.name] === filter.name) ? false : filter.name;
  }

  public applyFilter(filterId: number): void {
    this.searchComponent.applyFilter(filterId);
  }

  public applyExclusiveFilter(subFilterId: number, parentFilterId: number): void {
    this.searchComponent.applyExclusiveFilter(subFilterId, parentFilterId);
  }

  public hasCounts(filter:any): boolean {
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

  public isHeadingFilter(count: number): boolean {
    return count === -1;
  }

  public customValue(event: any, filter:any, formValue:any) {
    if(event.code === 'Enter') {
      this.searchComponent.applyCustomValue(filter, formValue);
    }
  }
}
