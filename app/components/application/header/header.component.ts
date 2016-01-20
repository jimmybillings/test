import {Component, ChangeDetectionStrategy, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component'


@Component({
  selector: 'app-header',
  templateUrl: '/app/components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout],
  inputs: ['currentUser']
})

export class Header {   
  @Input() currentUser; 
  
  constructor() {
    
  }
}
