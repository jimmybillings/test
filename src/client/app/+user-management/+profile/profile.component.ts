import { Component, OnDestroy} from '@angular/core';
import { CurrentUser} from '../../shared/services/current-user.model';
import { User} from '../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'profile',
  templateUrl: 'profile.html'
})

export class ProfileComponent implements OnDestroy {
  public user: User;
  private userSubscription: Subscription;

  constructor(currentUser: CurrentUser) {
    this.userSubscription = currentUser.profile.subscribe((user: User) => this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
