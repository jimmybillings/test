import {Component, OnDestroy} from '@angular/core';
import {CurrentUser} from '../../shared/services/current-user.model';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { CurrentUserInterface} from '../../shared/interfaces/current-user.interface';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'profile',
  templateUrl: 'profile.html',
  pipes: [TranslatePipe]
})

export class ProfileComponent implements OnDestroy {
  public user: CurrentUserInterface;
  private userSubscription: Subscription;

  constructor(currentUser: CurrentUser) {
    this.userSubscription =
      currentUser.profile.subscribe((user: CurrentUserInterface) => this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
