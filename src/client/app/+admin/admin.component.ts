import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {CurrentUser} from '../shared/services/current-user.model';
import {TranslatePipe} from 'ng2-translate/ng2-translate';


@Component({
  moduleId: module.id,
  selector: 'admin',
  templateUrl: 'admin.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe]
})

export class AdminComponent {
  constructor(public currentUser: CurrentUser) {}
}
