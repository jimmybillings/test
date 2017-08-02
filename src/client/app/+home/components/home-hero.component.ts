import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'home-hero',
  template: `
    <div *ngIf="isVideo" class="hero-video-container" [ngClass]="{'is-hidden' : isVideoHidden}">
      <div id="hero-video"></div>
    </div>
    <div class="hero-image-container" *ngIf="!isVideo">
      <div class="hero-image"></div>
    </div>
    <header class="hero">
      <div layout="row" md-scroll-y="" layout-align="center start" layout-padding>
        <div flex-gt-lg="35" flex-lg="40" flex-md="50" flex-gt-sm="55" flex-gt-xs="70" flex="100">
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

export class HomeHeroComponent implements OnInit {
  public isVideoHidden: boolean = true;

  @Input() config: any;
  @Input() currentUser: any;
  @Input() uiState: any;
  @Input() isVideo: boolean;
  @Output() searchContext: any = new EventEmitter();

  ngOnInit() {
    this.isVideoHidden = false;

    // this.heroVideo.subscribe((video: any) => {
    //   video.on('play', function () {
    //     this.isVideoHidden = false;
    //     console.log(`vid is playing and hidden is ${this.isVideoHidden}`)
    //   });
    // });

  }

}
