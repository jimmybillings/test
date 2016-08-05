import { Component, Input, Inject, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { SearchComponent } from './search.component';
// import { DatePicker } from 'ng2-datepicker/ng2-datepicker';
import { FORM_DIRECTIVES } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'filter',
  templateUrl: 'filter.html',
  directives: [FilterComponent, FORM_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterComponent {
  @Input() filters: any;
  public searchComponent: SearchComponent;
  constructor(
    @Inject(forwardRef(() => SearchComponent)) searchComponent:SearchComponent) {
      this.searchComponent = searchComponent;
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

  public applyExclusiveFilter(subFilterId: number, parentFilterId: number): void {
    this.searchComponent.applyExclusiveFilter(subFilterId, parentFilterId);
  }

  public customValue(event: any, filter:any, formValue:any) {
    if(event.code === 'Enter') {
      this.searchComponent.applyCustomValue(filter, formValue);
    }
  }
}
