import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { User } from '../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs/Rx';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WzComingSoonComponent } from '../../shared/components/wz-coming-soon/wz-coming-soon.component';

@Component({
  moduleId: module.id,
  selector: 'profile-component',
  templateUrl: 'profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent implements OnDestroy, OnInit {
  public user: User;
  private userSubscription: Subscription;

  constructor(private currentUser: CurrentUserService, private dialog: MdDialog) { }

  ngOnInit() {
    this.userSubscription =
      this.currentUser.data.subscribe((user: User) =>
        this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public comingSoonDialog() {
    let dialogRef: MdDialogRef<any> = this.dialog.open(WzComingSoonComponent, { position: { top: '16%' } });
    dialogRef.componentInstance.dialog = dialogRef;
  }
}
