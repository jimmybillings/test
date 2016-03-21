import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass, NgIf} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

/**
 * site header component - renders the header information
 */ 
@Component({
  selector: 'app-header',
  templateUrl: 'components/header/header.html',
  directives: [ROUTER_DIRECTIVES, NgClass, MATERIAL_DIRECTIVES, NgIf],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class Header {
  @Input() currentUser;
  @Input() config;
  @Output() onLogOut = new EventEmitter();

  public showFixed: boolean;
  
  
  public loggedInState: boolean;


  constructor() {
    this.showFixed = false;
  }

  /**
   * When the header component loads, setup a listener for window scrolling events, and call
   * the showFixedHeader() method when scrolling.
  */
  ngOnInit(): void {
    window.addEventListener('scroll', () => this.showFixedHeader(window.pageYOffset));
    this.config = this.config.config;
    this.loggedInState = this.currentUser.loggedInState();
  }
  
  /**
   * Display a fixed headerwith different styling when the page scrolls down past 68 pixels.
   * @param offset  window scrolling offset value used to calcuate which header to display.
  */
  public showFixedHeader(offset): void {
    this.showFixed = (offset > 68) ? true : false;
  }
  
  public logOut(event) {
    this.onLogOut.emit(event);
  }
  
}
