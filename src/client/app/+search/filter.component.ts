import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterService } from './services/filter.service';

@Component({
  moduleId: module.id,
  selector: 'filter',
  templateUrl: 'filter.html',
  providers: [FilterService],
  directives: [FilterComponent]
})

export class FilterComponent {
  @Input() filters: any;
  @Output() filterAssets = new EventEmitter();
  constructor(public filterService: FilterService) {}

  public toggleFilters(filter: any): void {
    filter.subFilters.map((filter: any) => {
      filter.expanded = !filter.expanded;
      return filter;
    });
  }

  public applyFilter(filter: any): void {
    this.filterAssets.emit(filter);
  }

  public doSomething(filter: any): void {
    this.filterAssets.emit(filter);
  }
}
