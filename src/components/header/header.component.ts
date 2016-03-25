import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass, NgIf, NgFor} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

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
  
  public loggedInState: boolean;

  ngOnInit(): void {
    this.config = this.config.config;
    this.loggedInState = this.currentUser.loggedInState();
  }

  public logOut(event) {
    this.onLogOut.emit(event);
  }
}
