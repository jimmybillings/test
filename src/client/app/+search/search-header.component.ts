import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'search-header',
  template: `
    	<section class="search-header" layout="row" layout-align="center center">
        <header flex-gt-lg="95" flex-lg="95" flex="100">
          <div layout="row" layout-align="space-between end">
            <h2 *ngIf="!hasResults" flex="100" class="md-display-1 alert"> 
              {{ 'SEARCH.NO_RESULTS.PG_HEADING' | translate }}
            </h2>
            <div *ngIf="hasResults" class="asset-sort-by tools" flex="auto">
              <button md-button class="is-dd" color="primary" [md-menu-trigger-for]="assetSortMenu">
                <span class="key">{{'SEARCH.SORT_BTN_LABEL' | translate }}</span>
                <span class="value md-caption">
                  {{ currentSort.name }}
                </span>
              </button>
              <md-menu x-position="before" #assetSortMenu="mdMenu">
                <wz-sort-component 
                  [current]="currentSort" 
                  [items]="sortDefinitionItems" 
                  (sort)="onSortResults.emit($event)">
                </wz-sort-component>
              </md-menu>
              <button md-icon-button color="primary" title="{{ (assetView == 'grid' ? 
                'SEARCH.ASSET_VIEW_LIST_BTN_TITLE' : 'SEARCH.ASSET_VIEW_GRID_BTN_TITLE') | translate }}" 
                (click)="onChangeAssetView.emit((assetView == 'grid') ? 'list' : 'grid')">
                <md-icon>{{ assetView == 'grid' ? 'view_list' : 'view_comfy' }}</md-icon>
              </button>
            </div>
          </div>
        </header>
      </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchHeaderComponent {
  @Input() hasResults: boolean = true;
  @Input() sortDefinitionItems: any;
  @Input() currentSort: any;
  @Input() assetView: string = 'grid';
  @Output() onChangeAssetView = new EventEmitter();
  @Output() onSortResults = new EventEmitter();
}
