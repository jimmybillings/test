import {Component} from '@angular/core';
import {CurrentUser} from '../../shared/services/current-user.model';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'profile',
  templateUrl: 'profile.html',
  pipes: [TranslatePipe]
})

export class ProfileComponent {
  public currentUser: CurrentUser;

  constructor(currentUser: CurrentUser) {
    this.currentUser = currentUser;
  }
}
