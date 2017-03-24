import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Response } from '@angular/http';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs/Rx';
import { UiConfig } from '../../shared/services/ui.config';
import { ServerErrors } from '../../shared/interfaces/forms.interface';
import { Observable } from 'rxjs/Rx';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WzTermsComponent } from '../../shared/components/wz-terms/wz.terms.component';
/**
 * Registration page component - renders registration page and handles submiting registation form.
 */
@Component({
  moduleId: module.id,
  selector: 'register-component',
  templateUrl: 'register.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegisterComponent implements OnInit, OnDestroy {
  public config: any;
  public serverErrors: ServerErrors = null;
  public newUser: any;
  public successfullySubmitted: boolean = false;
  private configSubscription: Subscription;

  constructor(
    public user: UserService,
    public uiConfig: UiConfig,
    private dialog: MdDialog,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.configSubscription =
      this.uiConfig.get('register').subscribe((config: any) =>
        this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public onSubmit(user: any): void {
    Object.assign(user, { termsAgreedTo: this.user.activeVersionId });
    this.user.create(user).take(1).subscribe((res: Response) => {
      this.successfullySubmitted = true;
      this.newUser = res;
      this.ref.markForCheck();
    }, (error => {
      if (error.status !== 451) this.serverErrors = error.json();
      this.ref.markForCheck();
    }));
  }

  public openTermsDialog() {
    this.user.downloadActiveTosDocument().take(1).subscribe((terms: any) => {
      let dialogRef: MdDialogRef<any> = this.dialog.open(WzTermsComponent);
      dialogRef.componentInstance.terms = terms;
      dialogRef.componentInstance.dialog = dialogRef;
    });
  }
}
