import { Component } from '@angular/core';
import { FilterService } from './services/filter.service';

@Component({
  moduleId: module.id,
  selector: 'filter',
  templateUrl: 'filter.html',
  providers: [FilterService]
})

export class FilterComponent {
  constructor(public filterService: FilterService) {}
}
