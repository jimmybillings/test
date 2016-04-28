import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass, NgIf, NgFor} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {SearchBox} from '../search-box/search-box.component';

/**
 * site header component - renders the header information
 */ 
@Component({
  selector: 'app-header',
  templateUrl: 'components/header/header.html',
  directives: [ROUTER_DIRECTIVES, NgClass, MATERIAL_DIRECTIVES, NgIf, NgFor, SearchBox],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Header {
  @Input() currentUser;
  @Input() config;
  @Input() supportedLanguages;
  @Input() showFixed;
  @Input() state;
  @Output() onLogOut = new EventEmitter();
  @Output() onChangeLang = new EventEmitter();
  public loggedInState: boolean;
  public components: Object;
  public searchBarIsActive: boolean;
  
  
  constructor(private _router: Router) {}
  
  ngOnInit(): void {
    this.components = this.config.components;
    this.config = this.config.config;
    this.loggedInState = this.currentUser.loggedInState();
  }

  public logOut(event) {
    this.onLogOut.emit(event);
  }
  
  ngOnChanges(changes) {
    if (changes.state) this.searchBarIsActive = this.checkRouteForSearchBar(changes.state.currentValue);  
  }
  
  public checkRouteForSearchBar(currentState: string): boolean {
    return ['', 'loggedOut=true', '?confirmed=true', 'user/profile', 'user/login', 'user/register', 'admin/']
      .filter((state) => state.indexOf(currentState) > -1).length === 0; 
  }
}
