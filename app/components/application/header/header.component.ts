
import {Component, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component'

@Component({
  selector: 'app-header',
  templateUrl: '/app/components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout, NgClass],
  inputs: ['currentUser']
})


export class Header {
  @Input() currentUser; 

  public isScrolled: boolean;
  
  constructor() {
    this.isScrolled = false; 
  }
  
  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.showScrollingHeader()
    }, false);
  }
  
  public toggle(newState) {
    this.isScrolled = newState;
  }
  

  showScrollingHeader() {
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
