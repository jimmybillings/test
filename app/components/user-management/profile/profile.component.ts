import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';
import {NgFor} from 'angular2/common';

@Component({
  selector: 'profile',
  templateUrl: 'components/user-management/profile/profile.html',
  directives:[NgFor]
})

export class Profile {    
    public currentUser: CurrentUser;
  
  constructor(currentUser: CurrentUser) {
     this.currentUser = currentUser;
  }
}
