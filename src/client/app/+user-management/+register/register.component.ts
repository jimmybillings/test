import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { User } from '../services/user.data.service';
import { Subscription } from 'rxjs/Rx';
import { UiConfig } from '../../shared/services/ui.config';
import { ServerErrors } from '../../shared/interfaces/forms.interface';
import { DocumentService } from '../services/document.service';
import { Observable } from 'rxjs/Rx';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WzTermsComponent } from '../../shared/components/wz-terms/wz.terms.component';
/**
 * Registration page component - renders registration page and handles submiting registation form.
 */
@Component({
  moduleId: module.id,
  selector: 'register-component',
  templateUrl: 'register.html'
})

export class RegisterComponent implements OnInit, OnDestroy {
  public config: any;
  public serverErrors: ServerErrors = null;
  public newUser: any;
  public successfullySubmitted: boolean = false;
  private configSubscription: Subscription;

  constructor(
    public user: User,
    public uiConfig: UiConfig,
    private document: DocumentService,
    private dialog: MdDialog) {
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
    Object.assign(user, { termsAgreedTo: this.document.activeVersionId });
    this.user.create(user).take(1).subscribe((res: Response) => {
      this.successfullySubmitted = true;
      this.newUser = res;
    }, (Error => {
      this.serverErrors = Error.json();
    }));
  }

  public openTermsDialog() {
    this.document.downloadActiveTosDocument().take(1).subscribe((terms: any) => {
      let dialogRef: MdDialogRef<any> = this.dialog.open(WzTermsComponent, { width: '50%', height: '600px' });
      dialogRef.componentInstance.terms = terms;
      dialogRef.componentInstance.dialog = dialogRef;
    });
  }
}
