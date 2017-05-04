import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { User } from '../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs/Subscription';
import { WzComingSoonComponent } from '../../shared/components/wz-coming-soon/wz-coming-soon.component';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';

@Component({
  moduleId: module.id,
  selector: 'profile-component',
  templateUrl: 'profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent implements OnDestroy, OnInit {
  public user: User;
  private userSubscription: Subscription;

  constructor(private currentUser: CurrentUserService, private dialogService: WzDialogService) { }

  ngOnInit() {
    this.userSubscription =
      this.currentUser.data.subscribe((user: User) =>
        this.user = user);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public comingSoonDialog() {
    this.dialogService.openComponentInDialog({
      componentType: WzComingSoonComponent,
      dialogConfig: { position: { top: '16%' } }
    });
  }
}
