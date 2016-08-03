import { Component, Input, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { SearchComponent } from '../../../+search/search.component';

@Component({
  moduleId: module.id,
  selector: 'breadcrumb',
  templateUrl: 'wz.breadcrumb.html',
  directives: [WzBreadcrumbComponent],
})

export class WzBreadcrumbComponent {
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
    this.activeFilters = [];
    this.getFilters(this.filters);
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
