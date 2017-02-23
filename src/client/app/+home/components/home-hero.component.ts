import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'home-hero',
  template: `
    <header class="hero">
      <div layout="row" md-scroll-y="" layout-align="center start" layout-padding>
        <div flex-gt-lg="40" flex-gt-md="50" flex-gt-sm="55" flex-gt-xs="70" flex="100">
          <div layout="column" layout-align="center">
            <div class="logo-wrapper">
              <div class="logo"></div>
            </div>
            <wz-autocomplete-search
              [config]="config"
              [currentUser]="currentUser" 
              [uiState]="uiState"
              (searchContext)="searchContext.emit($event)">
            </wz-autocomplete-search>
            <h4 class="md-headline">{{ 'HOME.SEARCH_HEADING' | translate }}</h4>
          </div>
        </div>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeHeroComponent {
  @Input() config: any;
  @Input() currentUser: any;
  @Input() uiState: any;
  @Output() searchContext: any = new EventEmitter();
}
