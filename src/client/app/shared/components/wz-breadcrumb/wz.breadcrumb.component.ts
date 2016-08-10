import { Component, Input, Output, EventEmitter, Inject, forwardRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { SearchComponent } from '../../../+search/search.component';

@Component({
  moduleId: module.id,
  selector: 'breadcrumb',
  templateUrl: 'wz.breadcrumb.html',
  directives: [WzBreadcrumbComponent],
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

  public getFilters(filter: any) {
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.getFilters(l);
      return filter;
    } else {
      if (filter.type === 'DateRange' && filter.filterValue) {
        let d = filter.filterValue.split(' - ');
        filter.filterValue = this.clientDate(d[0])+ ' - '+this.clientDate(d[1]);
      }
      if (filter.active) this.activeFilters.push(filter);
      return filter;
    }
  }

  public clientDate(date:any) {
    let d:any = new Date(date).toJSON().slice(0,10).split('-');
    return d[1]+'-'+d[2]+'-'+d[0];
  }
}
