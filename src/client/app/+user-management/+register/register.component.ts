import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Response } from '@angular/http';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs/Subscription';
import { UiConfig } from '../../shared/services/ui.config';
import { ServerErrors } from '../../shared/interfaces/forms.interface';
import { Observable } from 'rxjs/Observable';
import { WzTermsComponent } from '../../shared/components/wz-terms/wz.terms.component';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';

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
  private terms: any;

  constructor(
    public user: UserService,
    public uiConfig: UiConfig,
    private dialogService: WzDialogService,
    private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.configSubscription =
      this.uiConfig.get('register').subscribe((config: any) =>
        this.config = config.config);
    this.downloadTos();
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public downloadTos() {
    return this.user.downloadActiveTosDocument().take(1).subscribe((terms: any) => {
      this.terms = terms;
    });
  }

  public onSubmit(user: any): void {
    Object.assign(user, { termsAgreedTo: this.user.documentId });
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
    this.dialogService.openComponentInDialog({
      componentType: WzTermsComponent,
      inputOptions: {
        terms: this.terms,
        btnLabel: 'REGISTER.CLOSE_TOS_DIALOG',
        header: 'REGISTER.TOS_TITLE'
      }
    });
  }
}
