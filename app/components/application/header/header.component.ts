import {Component} from 'angular2/core';
import {
    RouteConfig, 
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS, 
    LocationStrategy, 
    HashLocationStrategy,
    AsyncRoute
} from 'angular2/router';

import {Logout} from '../../user-management/session/logout/logout.component'
import {Session} from '../../user-management/session/session.service'
import { ApiConfig } from '../../../services/api.config'

@Component({
  selector: 'app-header',
  templateUrl: '/app/components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout],
  providers:[Session, ApiConfig]
})

export class Header {    
  public session: Session;
  
  constructor(session: Session) {
    this.session = session;
    window.addEventListener('scroll', this._showScrollingHeader, false);
  }

  private _showScrollingHeader(e) {
    let isScrolled: boolean = false;
    
    if (window.pageYOffset > 80)
    {
      isScrolled = true;
      console.log(isScrolled);
      console.log(window.pageYOffset);
    }
    else
      isScrolled = false;
      console.log(isScrolled);
  }
  
}
