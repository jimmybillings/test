import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {NgIf} from 'angular2/common';
import {CurrentUser} from '../../common/models/current-user.model';
import {SearchBox} from './search-box/search-box.component';

@Component({
  selector: 'home',
  templateUrl: 'components/home/home.html',
  directives: [ROUTER_DIRECTIVES, NgIf, SearchBox]
})

export class Home {

  constructor(
    public currentUser: CurrentUser,
    public router: Router) {
  }
  
  // searchAssets(query: string): void {
    // console.log(query);
    // this.router.navigate(['/Search', {q: query}]);
  // }
}
