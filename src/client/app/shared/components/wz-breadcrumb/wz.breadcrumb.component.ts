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
  @Output() apply = new EventEmitter();
  @Output() clear = new EventEmitter();
  public searchComponent: SearchComponent;
  constructor( @Inject(forwardRef(() => SearchComponent)) searchComponent: SearchComponent) {
    this.searchComponent = searchComponent;
  }

  public clearFilter(filter: any) {
    this.searchComponent.applyFilter(filter.filterId);
  }
}
