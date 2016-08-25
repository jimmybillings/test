import { Component, OnInit, OnDestroy} from '@angular/core';
import { Response } from '@angular/http';
import { User } from '../services/user.data.service';
import { Subscription } from 'rxjs/Rx';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { FormFields, ServerErrors } from '../../shared/interfaces/forms.interface';
// import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';

/**
 * Registration page component - renders registration page and handles submiting registation form.
 */
@Component({
  moduleId: module.id,
  selector: 'register',
  templateUrl: 'register.html'
})

export class RegisterComponent implements OnInit, OnDestroy {
  public config: any;
  public serverErrors: ServerErrors = null;
  public components: Object;
  public fields: FormFields[];
  public newUser: any;
  public successfullySubmitted: boolean = false;
  private configSubscription: Subscription;

  constructor(
    public user: User,
    public _ApiConfig: ApiConfig,
    public uiConfig: UiConfig,
    public uiState: UiState) {
  }

  ngOnInit(): void {
    this.configSubscription = this.uiConfig.get('register').subscribe(config => this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  /**
   * Register a new user by subscribing to the user data services create method
   * @param user  Registration form field values sent to the user data service.
  */
  public onSubmit(user: any): void {
    user.siteName = this._ApiConfig.getPortal();
    this.uiState.loading(true);
    this.user.create(user).take(1)
      .subscribe(
        (res: Response) => {
          this.successfullySubmitted = true;
          this.newUser = res;
          this.uiState.loading(false);
        },
        (Error => {
          this.serverErrors = Error.json();
          this.uiState.loading(false);
        })
      );
  }
}
