import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {NgFor} from 'angular2/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  selector: 'profile',
  templateUrl: 'containers/user-management/profile/profile.html',
  directives: [NgFor],
  pipes: [TranslatePipe]
})

export class Profile {
  public currentUser: CurrentUser;

  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
