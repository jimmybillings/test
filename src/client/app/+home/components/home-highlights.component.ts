import { Pojo } from '../../shared/interfaces/common.interface';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AppStore } from '../../app.store';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'home-highlights',
  template: `
    <section layout="row" layout-align="center start" class="mrkt-collections">
      <div flex-gt-lg="70" flex-lg="70" flex-gt-md="80" flex-gt-sm="90" flex="100" layout="row" layout-wrap="">
        <div *ngFor="let highlight of highlights | async; let i = index" 
          flex-gt-xs="33" flex="100" 
          class="mrkt-collections__highlight"
        >
          <a *ngIf="config" [routerLink]="['/search', {q: highlight.link}]">
            <div class="mrkt-collections__highlight_img" [style.background-image]="highlight.url"></div>
            <div class="mrkt-collections__highlight_content">
              <h5 class="mat-title">{{highlight.label}}</h5>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeHighlightsComponent {
  @Input() config: any;

  constructor(private store: AppStore, private sanitizer: DomSanitizer) { }

  public buildSearchContext(context: any): any {
    context = JSON.parse(context);
    for (let param in context) {
      if (context[param] === '') delete (context[param]);
    }
    return context;
  }

  public get highlights() {
    return this.store.select(factory => factory.cms.homeAssets)
      .filter(homeAssets => homeAssets !== null)
      .map(homeAssets => {
        return homeAssets.highlights.map((hightlight: Pojo) => {
          return {
            url: this.sanitizer.bypassSecurityTrustStyle(`url(http:${hightlight.url})`),
            label: hightlight.label,
            link: hightlight.link
          }
        });
      });
  }
}
