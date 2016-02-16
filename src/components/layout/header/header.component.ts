import {Component, Input} from 'angular2/core';
import {NgClass, NgIf} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

@Component({
  selector: 'app-header',
  templateUrl: 'components/layout/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout, NgClass, MATERIAL_DIRECTIVES, NgIf],
  inputs: ['currentUser', 'ui']
})


export class Header {
  @Input() currentUser;
  @Input() ui;
  public showFixed: boolean;

  constructor() {
    this.showFixed = false;
  }

  ngOnInit(): void {
    window.addEventListener('scroll', () => this.showFixedHeader(window.pageYOffset));
  }

  public showFixedHeader(offset): void {
    this.showFixed = (offset > 68) ? true : false;
  }
}
