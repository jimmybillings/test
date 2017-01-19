import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUser } from '../../shared/services/current-user.model';
import { User } from '../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs/Rx';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WzComingSoonComponent } from '../../shared/components/wz-coming-soon/wz-coming-soon.component';

@Component({
  moduleId: module.id,
  selector: 'profile-component',
  templateUrl: 'profile.html'
})

export class ProfileComponent implements OnDestroy, OnInit {
  public user: User;
  private userSubscription: Subscription;

  constructor(private currentUser: CurrentUser, private dialog: MdDialog) { }

  ngOnInit() {
    this.userSubscription =
      this.currentUser.data.subscribe((user: User) =>
        this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public comingSoonDialog() {
    let dialogRef: MdDialogRef<any> = this.dialog.open(WzComingSoonComponent, { width: '400px', height: '160px' });
    dialogRef.componentInstance.dialog = dialogRef;
  }
}
