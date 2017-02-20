import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'home-call-to-action',
  template: `
    <section class="mrkt-call-to-action">
      <div layout="row" layout-align="center start" layout-padding="">
        <div flex-gt-lg="60" flex-gt-md="70" flex="95" layout-align="center start">
          <h2 class="md-display-1">{{ 'HOME.DESCRIPTION' | translate}}</h2>
          <button *ngIf="!currentUser.loggedIn()" md-button [routerLink]="['/user/register']" class="md-block conversion">{{'HOME.START_PROJECT' | translate }} </button>
          <button *ngIf="currentUser.loggedIn()" md-button [routerLink]="['/user']" class="md-block conversion">{{'HOME.START_PROJECT' | translate }} </button>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeCallToActionComponent {
  @Input() config: any;
  @Input() currentUser: any;
}
