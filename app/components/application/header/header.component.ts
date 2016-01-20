import {Component} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component'
import {CurrentUser} from '../../../common/models/current-user.model'

@Component({
  selector: 'app-header',
  templateUrl: '/app/components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout, NgClass],
  providers:[CurrentUser],
})




export class Header {
  public currentUser: CurrentUser;
  isScrolled: boolean = false;
  
  constructor(currentUser: CurrentUser) {
    window.addEventListener('scroll', this.showScrollingHeader, false);
    this.currentUser = currentUser;
  }
  public toggle(newState) {
    this.isScrolled = newState;
  }

  public showScrollingHeader() {
    if (window.pageYOffset > 80)
    {
      this.isScrolled = true;
      console.log(this.isScrolled);
      console.log(window.pageYOffset);
    }
    else
    {
      this.isScrolled = false;
      console.log(this.isScrolled);
    }
  }
}
