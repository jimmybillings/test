import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { User } from '../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'profile-component',
  templateUrl: 'profile.html'
})

export class ProfileComponent implements OnDestroy, OnInit {
  public user: User;
  private userSubscription: Subscription;

  constructor(private currentUser: CurrentUser) { }

  ngOnInit() {
    this.userSubscription =
      this.currentUser.data.subscribe((user: User) =>
        this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
