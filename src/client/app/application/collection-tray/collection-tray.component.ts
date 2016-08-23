import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from '../../shared/interfaces/collection.interface';

/**
 * Home page search component - renders search form passes form values to search component.
 */
@Component({
  moduleId: module.id,
  selector: 'collection-tray',
  templateUrl: 'collection-tray.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CollectionTrayComponent {
  @Input() collection: Collection;
  @Input() UiState: any;
  @Input() uiConfig: any;

  constructor(public router: Router) { }


}
