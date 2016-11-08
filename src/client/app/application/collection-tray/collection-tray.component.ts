import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActiveCollectionService } from '../../shared/services/active-collection.service';
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
  @Input() uiState: any;
  @Input() uiConfig: any;
  public pageSize: string;

  constructor(public activeCollection: ActiveCollectionService) { }

  ngOnInit() {
    this.uiConfig.get('global').take(1).subscribe((config: any) => {
      this.pageSize = config.config.pageSize.value;
    });
  }
}
