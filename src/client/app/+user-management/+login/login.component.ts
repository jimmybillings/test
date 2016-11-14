import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Authentication } from '../../shared/services/authentication.data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { DocumentService } from '../services/document.service';
import { Observable } from 'rxjs/Rx';
/**
 * Login page component - renders login page and handles login form submission
 */

declare var pendo: any;

@Component({
  moduleId: module.id,
  selector: 'login-component',
  templateUrl: 'login.html',
})

export class LoginComponent implements OnInit, OnDestroy {
  public config: any;
  public activeTos: Observable<any>;
  public firstTimeUser: boolean;
  @ViewChild('termsDialog') public termsDialog: any;
  private configSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private authentication: Authentication,
    private router: Router,
    private currentUser: CurrentUser,
    private document: DocumentService,
    private uiConfig: UiConfig,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: any) => {
      if (params.newUser === 'true') {
        this.firstTimeUser = true;
      }
    });
    this.activeTos = this.document.downloadActiveTosDocument();
    this.configSubscription =
      this.uiConfig.get('login').subscribe((config: any) =>
        this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public onSubmit(user: any): void {
    this.authentication.create(user).take(1).subscribe((res) => {
      if (res.documentsRequiringAgreement && res.documentsRequiringAgreement.indexOf('TOS') > -1) {
        this.termsDialog.show();
      } else {
        this.router.navigate(['/']);
      }
      this.initializePendo(res.user);
      this.currentUser.set(res.user, res.token.token);
    });
  }

  public agreeToTermsAndClose(): void {
    this.document.agreeUserToTerms();
    this.router.navigate(['/']);
  }

  private initializePendo(user: any): void {
    let userUniqueIdentifier: string = `${user.siteName}-${user.id}-${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`;
    let accountUniqueIdentifier: string = `${user.siteName}-${user.accountId}`;
    pendo.initialize({
      // Need a way to remove the api key from the source code
      apiKey: '7e5da402-5d29-41b0-5579-6e149b0a28f2',
      visitor: { id: userUniqueIdentifier, email: user.emailAddress },
      account: { id: accountUniqueIdentifier }
    });
  }
}
