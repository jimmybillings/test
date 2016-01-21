import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Authentication} from '../../../common/services/authentication.data.service';


@Component({
  selector: 'logout',
  templateUrl: 'components/user-management/logout/logout.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [Authentication]
})

export class Logout {    
    private _authentication: Authentication;
  
  constructor(_authentication: Authentication) {
     this._authentication = _authentication;
  }
  
  public onSubmit() {
       this._authentication.destory();
  }
}
