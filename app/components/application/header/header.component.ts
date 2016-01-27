import {Component, Input} from 'angular2/core';
import {NgClass, NgIf} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

@Component({
  selector: 'app-header',
  templateUrl: 'components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout, NgClass, MATERIAL_DIRECTIVES, NgIf],
  inputs: ['currentUser']
})


export class Header {
  @Input() currentUser; 
  public showFixed: boolean;
  
  constructor() {
    this.showFixed = false; 
  }
  
  ngOnInit() {
    window.addEventListener('scroll', () => this.showFixedHeader(window.pageYOffset));
  }
  
  public showFixedHeader(offset) { 
    this.showFixed = (offset > 68) ? true : false;
  }
  
  
}
