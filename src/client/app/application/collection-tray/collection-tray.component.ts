import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from '../../shared/interfaces/collection.interface';
import { ActiveCollectionService} from '../../+collection/services/active-collection.service';
import { Observable } from 'rxjs/Rx';
/**
 * Home page search component - renders search form passes form values to search component.
 */
@Component({
  moduleId: module.id,
  selector: 'collection-tray',
  templateUrl: 'collection-tray.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CollectionTrayComponent implements OnInit {
  @Input() UiState: any;
  @Input() uiConfig: any;
  public collection: Observable<Collection>;
  public pageSize: string;

  constructor(public router: Router, public activeCollection: ActiveCollectionService) {
    this.collection = activeCollection.data;
  }

  ngOnInit() {
    this.uiConfig.get('global').take(1).subscribe((config: any) => {
      this.pageSize = config.config.pageSize.value;
    });
  }
}
