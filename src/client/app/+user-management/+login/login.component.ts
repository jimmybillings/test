import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Authentication } from '../../shared/services/authentication.data.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { DocumentService } from '../services/document.service';
import { Observable } from 'rxjs/Rx';
/**
 * Login page component - renders login page and handles login form submission
 */
@Component({
  moduleId: module.id,
  selector: 'login-component',
  templateUrl: 'login.html',
})

export class LoginComponent implements OnInit, OnDestroy {
  public config: any;
  public activeTos: Observable<any>;
  @ViewChild('termsDialog') public termsDialog: any;
  private configSubscription: Subscription;

  constructor(
    private authentication: Authentication,
    private router: Router,
    private currentUser: CurrentUser,
    private document: DocumentService,
    private uiConfig: UiConfig) {
  }

  ngOnInit(): void {
    this.activeTos = this.document.downloadActiveTosDocument();
    this.configSubscription =
      this.uiConfig.get('login').subscribe((config: any) =>
        this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public onSubmit(user: any): void {
    this.authentication.create(user).take(1).subscribe((res) => {
      if (res.documentsRequiringAgreement && res.documentsRequiringAgreement.indexOf('TOS') > -1) {
        this.termsDialog.show();
      } else {
        this.router.navigate(['/']);
      }
      this.currentUser.set(res.user, res.token.token);
    });
  }

  public agreeToTermsAndClose(): void {
    this.document.agreeUserToTerms();
    this.router.navigate(['/']);
  }
}
