import { Component } from '@angular/core';
import { Capabilities } from '../../services/capabilities.service';

@Component({
  moduleId: module.id,
  selector: 'not-found-component',
  template: `<div layout="column" layout-align="center center">
              <div flex="85">
                <div layout="column" layout-align="center center">
                  <h3 class="mat-display not-found-header">{{ 'NOT_FOUND.HEADER' | translate }}</h3>
                </div>
                <div layout="row" layout-align="center center">
                  <button
                    color="primary"
                    mat-icon-button
                    [routerLink]="['/']">
                      <mat-icon>home</mat-icon>
                  </button>
                  <button
                    color="primary"
                    *ngIf="showCartLink"
                    mat-icon-button
                    [routerLink]="['/cart']">
                      <mat-icon>shopping_cart</mat-icon>
                  </button>
                  <button
                    color="primary"
                    *ngIf="showCollectionsLink"
                    mat-icon-button
                    [routerLink]="['/collections']">
                      <mat-icon>folder_open</mat-icon>  
                  </button>
                  <button
                    color="primary"
                    *ngIf="showQuotesLink"
                    mat-icon-button
                    [routerLink]="['/quotes']">
                      <mat-icon>inbox</mat-icon>
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
