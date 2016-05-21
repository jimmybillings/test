import {Component} from '@angular/core';
import {CurrentUser} from '../../shared/services/current-user.model';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  selector: 'profile',
  templateUrl: 'app/+user-management/+profile/profile.html',
  pipes: [TranslatePipe]
})

export class ProfileComponent {
  public currentUser: CurrentUser;

  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
