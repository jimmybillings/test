import { Component } from '@angular/core';
import { Capabilities } from '../../services/capabilities.service';

@Component({
  moduleId: module.id,
  selector: 'not-found-component',
  template: `<div layout="column" layout-align="center center">
              <div flex="85">
                <div layout="column" layout-align="center center">
                  <h3 class="md-display not-found-header">{{ 'NOT_FOUND.HEADER' | translate }}</h3>
                </div>
                <div layout="row" layout-align="center center">
                  <button
                    color="primary"
                    md-icon-button
                    [routerLink]="['/']">
                      <md-icon>home</md-icon>
                  </button>
                  <button
                    color="primary"
                    *ngIf="showCartLink"
                    md-icon-button
                    [routerLink]="['/commerce']">
                      <md-icon>shopping_cart</md-icon>
                  </button>
                  <button
                    color="primary"
                    *ngIf="showCollectionsLink"
                    md-icon-button
                    [routerLink]="['/collections']">
                      <md-icon>folder_open</md-icon>  
                  </button>
                  <button
                    color="primary"
                    *ngIf="showQuotesLink"
                    md-icon-button
                    [routerLink]="['/commerce/quotes']">
                      <md-icon>inbox</md-icon>
                  </button>
                </div>
              </div>
            </div>`
})

export class WzNotFoundComponent {
  constructor(public userCan: Capabilities) { }

  public get showCartLink(): boolean {
    return this.userCan.addToCart() && !this.userCan.administerQuotes();
  }

  public get showCollectionsLink(): boolean {
    return this.userCan.viewCollections();
  }

  public get showQuotesLink(): boolean {
    return this.userCan.administerQuotes();
  }
}
