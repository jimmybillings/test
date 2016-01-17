import {Component} from 'angular2/core';
import {
    RouteConfig, 
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS, 
    LocationStrategy, 
    HashLocationStrategy,
    AsyncRoute
} from 'angular2/router';

import {Session} from '../session.service'
import { ApiConfig } from '../../../../services/api.config'

@Component({
  selector: 'logout',
  templateUrl: '/app/components/user-management/session/logout/logout.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [Session, ApiConfig]
})

export class Logout {    
    public _session: Session;
  
  constructor(_session: Session) {
     this._session = _session;
  }
  
  public onSubmit() {
       this._session.destory()
  }
}
