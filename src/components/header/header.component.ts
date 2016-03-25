import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass, NgIf, NgFor} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {ControlGroup, Control} from 'angular2/common';

/**
 * site header component - renders the header information
 */ 
@Component({
  selector: 'app-header',
  templateUrl: 'components/header/header.html',
  directives: [ROUTER_DIRECTIVES, NgClass, MATERIAL_DIRECTIVES, NgIf, NgFor],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class Header {
  @Input() currentUser;
  @Input() config;
  @Input() supportedLanguages;
  @Input() showFixed;
  @Output() onLogOut = new EventEmitter();
  @Output() onChangeLang = new EventEmitter();
  
  public langForm: ControlGroup;
  public loggedInState: boolean;


  constructor() {
    this.langForm = new ControlGroup({
      lang: new Control('en')
    });
  }

  /**
   * When the header component loads, setup a listener for window scrolling events, and call
   * the showFixedHeader() method when scrolling.
  */
  ngOnInit(): void {
    this.config = this.config.config;
    this.loggedInState = this.currentUser.loggedInState();
  }
  
  public logOut(event) {
    this.onLogOut.emit(event);
  }
  
  public changeLang(lang) {
    this.onChangeLang.emit(lang);
  }
  
}
