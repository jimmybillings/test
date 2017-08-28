import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Authentication } from '../../shared/services/authentication.data.service';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UiConfig } from '../../shared/services/ui.config';
import { UserService } from '../../shared/services/user.service';
import { PendoService } from '../../shared/services/pendo.service';
import { Session, Credentials } from '../../shared/interfaces/session.interface';
import { Observable } from 'rxjs/Observable';
import { WzTermsComponent } from '../../shared/components/wz-terms/wz.terms.component';
import { FeatureStore } from '../../shared/stores/feature.store';
import { WzDialogService } from '../../shared/modules/wz-dialog/services/wz.dialog.service';
import { AppStore } from '../../app.store';

@Component({
  moduleId: module.id,
  selector: 'login-component',
  templateUrl: 'login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent implements OnInit, OnDestroy {
  public config: any;
  public firstTimeUser: boolean;
  private configSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private authentication: Authentication,
    private router: Router,
    private currentUser: CurrentUserService,
    private user: UserService,
    private uiConfig: UiConfig,
    private pendo: PendoService,
    private dialogService: WzDialogService,
    private feature: FeatureStore,
    private store: AppStore) { }

  ngOnInit(): void {
    this.firstTimeUser = this.router.routerState.snapshot.url.indexOf('newUser=true') > -1;

    this.configSubscription =
      this.uiConfig.get('login').subscribe((config: any) =>
        this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public onSubmit(user: Credentials): void {
    this.authentication.create(user).subscribe((session: Session) => {

      this.currentUser.set(session.user, session.token.token);
      this.pendo.initialize(session.user);
      if (session.siteFeatures) this.feature.set(session.siteFeatures);

      if (session.documentsRequiringAgreement &&
        session.documentsRequiringAgreement.indexOf('TOS') > -1) {
        this.showTerms();
      } else { this.redirectUserAppropriately(); }
    });
  }

  private showTerms(): void {
    this.user.downloadActiveTosDocument().take(1).subscribe((terms: string) => {
      this.dialogService.openComponentInDialog({
        componentType: WzTermsComponent,
        inputOptions: {
          terms: terms,
          btnLabel: 'LOGIN.AGREE_TO_TOS',
          header: 'LOGIN.TOS_TITLE'
        }
      }).subscribe(() => this.agreeToTermsAndClose());
    });
  }

  private redirectUserAppropriately(): void {
    this.store.dispatch(factory => factory.router.followRedirect());
    this.uiConfig.load().subscribe((_: any) => _);
  }

  private agreeToTermsAndClose = (): void => {
    this.user.agreeUserToTerms();
    this.redirectUserAppropriately();
  }
}
