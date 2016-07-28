import { Component, OnInit, OnDestroy} from '@angular/core';
import { Response } from '@angular/http';
import { User } from '../services/user.data.service';
import { Subscription } from 'rxjs/Rx';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig } from '../../shared/services/ui.config';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';

/**
 * Registration page component - renders registration page and handles submiting registation form.
 */
@Component({
  moduleId: module.id,
  selector: 'register',
  templateUrl: 'register.html',
  providers: [User],
  directives: [
    ROUTER_DIRECTIVES,
    WzFormComponent
  ]
})

export class RegisterComponent implements OnInit, OnDestroy {
  public config: any;
  public components: Object;
  public fields: FormFields[];
  private configSubscription: Subscription;

  constructor(
    public user: User,
    public _ApiConfig: ApiConfig,
    public uiConfig: UiConfig) {
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
    this.user.create(user).take(1)
      .subscribe((res: Response) => {
        return res;
      });
  }
}
