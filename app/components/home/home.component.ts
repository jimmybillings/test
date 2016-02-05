import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {NgIf} from 'angular2/common';
import {CurrentUser} from '../../common/models/current-user.model';
import {SearchBox} from './search-box/search-box.component';

@Component({
  selector: 'home',
  templateUrl: 'components/home/home.html',
  directives: [ROUTER_DIRECTIVES, NgIf, SearchBox]
})

export class Home {
  public currentUser: CurrentUser;
  
  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
  
  searchAssets(text: string): void {
    console.log(text);
  }
}
