import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Collection } from '../../shared/interfaces/collection.interface';
import { WzDropdownComponent } from '../../shared/components/wz-dropdown/wz.dropdown.component';
import { CollectionListDdComponent } from '../../+collection/components/collections-list-dd.component';

/**
 * Home page search component - renders search form passes form values to search component.
 */
@Component({
  moduleId: module.id,
  selector: 'bin-tray',
  templateUrl: 'bin-tray.html',
  directives: [ROUTER_DIRECTIVES, WzDropdownComponent, CollectionListDdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BinTrayComponent {
  @Input() collection: Collection;
  @Input() UiState: any;

  constructor(public router: Router) {}
}
