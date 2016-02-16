import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {NgIf} from 'angular2/common';
import {CurrentUser} from '../../common/models/current-user.model';
import {SearchBox} from './search-box/search-box.component';
import {UiConfig} from '../../common/config/ui.config';

@Component({
  selector: 'home',
  templateUrl: 'components/home/home.html',
  directives: [ROUTER_DIRECTIVES, NgIf, SearchBox]
})

export class Home {
  public ui: Object;
  constructor(
    public currentUser: CurrentUser,
    public router: Router,
    public uiConfig: UiConfig) {
    this.ui = this.uiConfig.ui();
  }
}
