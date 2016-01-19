import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component'
import {CurrentUser} from '../../../common/models/current-user.model'

@Component({
  selector: 'app-header',
  templateUrl: '/app/components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout],
  providers:[CurrentUser]
})

export class Header {    
  public currentUser: CurrentUser;
  
  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
