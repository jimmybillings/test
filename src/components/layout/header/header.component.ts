import {Component, Input} from 'angular2/core';
import {NgClass, NgIf} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Logout} from '../../user-management/logout/logout.component';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

/**
 * site header component - renders the header information
 */ 
@Component({
  selector: 'app-header',
  templateUrl: 'components/layout/header/header.html',
  directives: [ROUTER_DIRECTIVES, Logout, NgClass, MATERIAL_DIRECTIVES, NgIf]
})


export class Header {
  @Input() currentUser;
  @Input() config;
  public showFixed: boolean;

  constructor() {
    this.showFixed = false;
  }

  /**
   * When the header component loads, setup a listener for window scrolling events, and call
   * the showFixedHeader() method when scrolling.
  */
  ngOnInit(): void {
    window.addEventListener('scroll', () => this.showFixedHeader(window.pageYOffset));
  }
  
  /**
   * Display a fixed headerwith different styling when the page scrolls down past 68 pixels.
   * @param offset  window scrolling offset value used to calcuate which header to display.
  */
  public showFixedHeader(offset): void {
    this.showFixed = (offset > 68) ? true : false;
  }
}
