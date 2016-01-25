import {Component, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

@Component({
  selector: 'app-header',
  templateUrl: 'components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout, NgClass, MATERIAL_DIRECTIVES],
  inputs: ['currentUser']
})


export class Header {
  @Input() currentUser; 
  public showFixed: boolean;
  
  constructor() {
    this.showFixed = false; 
  }
  
  ngOnInit() {
    window.addEventListener('scroll', () => this._showFixedHeader());
  }
  
  private _showFixedHeader() { 
    this.showFixed = (window.pageYOffset > 68) ? true : false;
  }
  
  
}
