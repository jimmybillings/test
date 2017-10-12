import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'search-header',
  template: `
    	<section class="search-header" layout="row" layout-align="center center">
        <header flex-gt-lg="95" flex-lg="95" flex="100">
          <div layout="row" layout-align="space-between end">
            <wz-gallery-breadcrumb *ngIf="path" [path]="path" (clickBreadcrumb)="onClickBreadcrumb.emit($event)"></wz-gallery-breadcrumb>
            <h2 *ngIf="!hasResults" flex="100" class="mat-display-1 alert"> 
              {{ 'SEARCH.NO_RESULTS.PG_HEADING' | translate }}
            </h2>
            <div *ngIf="hasResults" class="asset-sort-by tools" flex="auto">
              <button mat-button class="is-dd" color="primary" [mat-menu-trigger-for]="assetSortMenu">
                <span class="key">{{'SEARCH.SORT_BTN_LABEL' | translate }}</span>
                <span class="value mat-caption">
                  {{ currentSort.name }}
                </span>
              </button>
              <mat-menu x-position="before" #assetSortMenu="matMenu">
                <wz-sort-component 
                  [current]="currentSort" 
                  [items]="sortDefinitionItems" 
                  (sort)="onSortResults.emit($event)">
                </wz-sort-component>
              </mat-menu>
              <button mat-icon-button color="primary" title="{{ (assetView == 'grid' ? 
                'SEARCH.ASSET_VIEW_LIST_BTN_TITLE' : 'SEARCH.ASSET_VIEW_GRID_BTN_TITLE') | translate }}" 
                (click)="onChangeAssetView.emit((assetView == 'grid') ? 'list' : 'grid')">
                <mat-icon>{{ assetView == 'grid' ? 'view_list' : 'view_comfy' }}</mat-icon>
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
  @Input() path: any;
  @Output() onChangeAssetView = new EventEmitter();
  @Output() onSortResults = new EventEmitter();
  @Output() onClickBreadcrumb = new EventEmitter();
}
