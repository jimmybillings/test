
import {Component, Input} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component';

@Component({
  selector: 'app-header',
  templateUrl: 'components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout, NgClass],
  inputs: ['currentUser']
})


export class Header {
  @Input() currentUser; 
  public showFixed: boolean;
  public slideUp: boolean;
  
  constructor() {
    this.showFixed = false; 
    this.slideUp = false; 
  }
  
  ngOnInit() {
     this.showFixedHeader();
  }
  
  public showFixedHeader() {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 68) { 
        this.showFixed = true;
        console.log(window.pageYOffset);
      } else { 
        this.showFixed = false;
        console.log(window.pageYOffset);
      }
      if (window.pageYOffset < 65 && window.pageYOffset > 70) { 
        this.slideUp = true;
        console.log(window.pageYOffset);
      } else { 
        this.slideUp = false;
        console.log(window.pageYOffset);
      }
    }, false);
  }
}
