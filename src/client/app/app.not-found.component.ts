import { Component } from '@angular/core';
import { CurrentUserService } from './shared/services/current-user.service';

@Component({
  moduleId: module.id,
  selector: 'not-found-component',
  template: `<div layout-align="center center">
              <div layout="column" layout-align="center center">
                <div flex-xs="85" flex-gt-xs="90" flex-gt-lg="95">
                  <div class="warn-message" layout="column" layout-align="center center">
                    <h3 class="md-display">The page you're looking for doesn't exist</h3>
                  </div>
                  <div layout="row" layout-align="center center">
                    <button class="link" md-button [routerLink]="['/']">HOME</button>
                    <button *ngIf="currentUser.loggedIn()" class="link" md-button [routerLink]="['/commerce']">CART</button>
                    <button *ngIf="currentUser.loggedIn()" class="link" md-button [routerLink]="['/collections']">COLLECTIONS</button>
                  </div>
                </div>
              </div>
            </div>`,
  styles: [`
            button.link {
              margin-right: 10px;
              border: 1px solid #ccc; 
            }
          `]
})

export class NotFoundComponent {
  constructor(public currentUser: CurrentUserService) { }
}
