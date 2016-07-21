import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FilterService } from './services/filter.service';

@Component({
  moduleId: module.id,
  selector: 'filter',
  templateUrl: 'filter.html',
  providers: [FilterService]
})

export class FilterComponent implements OnInit, OnDestroy {
  @Input() filters: any;
  constructor(public filterService: FilterService) {}

  ngOnInit() {
    // this.filtersStoreSubscription = this.filterService.filters.subscribe(data => {this.filters = data; console.log(data)});
    // this.filterService.getFilters({q: 'cat', counted: true}).first().subscribe();
  }

  ngOnDestroy() {
    // this.filtersStoreSubscription.unsubscribe();
  }
}
