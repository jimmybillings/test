import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { User } from '../services/user.data.service';
import { Subscription } from 'rxjs/Rx';
import { UiConfig } from '../../shared/services/ui.config';
import { FormFields, ServerErrors } from '../../shared/interfaces/forms.interface';
import { DocumentService } from '../services/document.service';
import { Observable } from 'rxjs/Rx';
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
  public components: Object;
  public fields: FormFields[];
  public newUser: any;
  public successfullySubmitted: boolean = false;
  public activeTos: Observable<any>;
  private configSubscription: Subscription;

  constructor(
    public user: User,
    public uiConfig: UiConfig,
    private document: DocumentService) {
  }

  ngOnInit(): void {
    this.configSubscription = this.uiConfig.get('register').subscribe(config => this.config = config.config);
    this.activeTos = this.document.downloadActiveTosDocument();
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  /**
   * Register a new user by subscribing to the user data services create method
   * @param user  Registration form field values sent to the user data service.
  */
  public onSubmit(user: any): void {
    this.user.create(user).take(1).subscribe((res: Response) => {
      this.successfullySubmitted = true;
      this.newUser = res;
    }, (Error => {
      this.serverErrors = Error.json();
    }));
  }

  public agreeToTerms(): void {
    let agreeCheckbox = <HTMLFormElement>document.querySelector('.md-checkbox-layout');
    agreeCheckbox.click();
  }
}
