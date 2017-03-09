import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Authentication } from '../../shared/services/authentication.data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UiConfig } from '../../shared/services/ui.config';
import { UserService } from '../../shared/services/user.service';
import { PendoService } from '../../shared/services/pendo.service';
import { Observable } from 'rxjs/Rx';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WzTermsComponent } from '../../shared/components/wz-terms/wz.terms.component';
import { FeatureStore } from '../../shared/stores/feature.store';

declare var portal: string;

@Component({
  moduleId: module.id,
  selector: 'login-component',
  templateUrl: 'login.html',
})

export class LoginComponent implements OnInit, OnDestroy {
  public config: any;
  public activeTos: Observable<any>;
  public firstTimeUser: boolean;
  private configSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private authentication: Authentication,
    private router: Router,
    private currentUser: CurrentUserService,
    private user: UserService,
    private uiConfig: UiConfig,
    private route: ActivatedRoute,
    private pendo: PendoService,
    private dialog: MdDialog,
    private feature: FeatureStore) {

  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: any) => {
      if (params.newUser === 'true') {
        this.firstTimeUser = true;
      }
    });
    this.activeTos = this.user.downloadActiveTosDocument();
    this.configSubscription =
      this.uiConfig.get('login').subscribe((config: any) =>
        this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public onSubmit(user: any): void {
    this.authentication.create(user).subscribe((res) => {

      this.currentUser.set(res.user, res.token.token);
      this.pendo.initialize(res.user);

      if (res.siteFeatures) {
        this.feature.setInLocalStorage(res.siteFeatures);
        this.feature.set(res.siteFeatures);
      }

      if (res.documentsRequiringAgreement && res.documentsRequiringAgreement.indexOf('TOS') > -1) {
        this.showTerms();
      } else {
        this.router.navigate(['/']).then((_: any) => {
          this.uiConfig.load(res.user.siteName).subscribe((_: any) => _);
        });
      }
    });
  }

  public showTerms() {
    this.user.downloadActiveTosDocument().take(1).subscribe((terms: any) => {
      let dialogRef: MdDialogRef<any> = this.dialog.open(WzTermsComponent, { disableClose: true });
      dialogRef.componentInstance.terms = terms;
      dialogRef.componentInstance.dialog = dialogRef;
      dialogRef.afterClosed().subscribe(_ => this.agreeToTermsAndClose());
    });
  }

  public agreeToTermsAndClose(): void {
    this.user.agreeUserToTerms();
    this.router.navigate(['/']);
  }

}
