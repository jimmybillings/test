import {Component} from 'angular2/core';
import {CurrentUser} from '../../../common/models/current-user.model';

@Component({
  selector: 'profile',
  templateUrl: 'components/user-management/profile/profile.html'
})

export class Profile {    
    public currentUser: CurrentUser;
  
  constructor(currentUser: CurrentUser) {
     this.currentUser = currentUser;
     console.log(this.currentUser.account());
  }
}
