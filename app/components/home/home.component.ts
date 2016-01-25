import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CurrentUser} from '../../common/models/current-user.model';

@Component({
  selector: 'home',
  templateUrl: 'components/home/home.html',
  directives: [ROUTER_DIRECTIVES]
})

export class Home {

  public currentUser: CurrentUser;
  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
 
}
