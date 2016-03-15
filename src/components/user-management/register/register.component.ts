import { Component } from 'angular2/core';
import { Response } from 'angular2/http';
import { User } from '../user.data.service';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import { UiConfig } from '../../../common/config/ui.config';
import { IFormFields } from '../../../common/interfaces/forms.interface';
import { WzForm } from '../../../common/components/wz-form/wz.form.component';

/**
 * Registration page component - renders registration page and handles submiting registation form.
 */
@Component({
  selector: 'register',
  templateUrl: 'components/user-management/register/register.html',
  providers: [User],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, WzForm]
})

export class Register {
  public config: any;
  public components: Object;
  public fields: IFormFields[];
  
  constructor(
    public user: User,
    private _ApiConfig: ApiConfig,
    public uiConfig: UiConfig) {
  }
  
  ngOnInit(): void {
    this.config = this.uiConfig.get('register');
    this.config = this.config.config;
    this.fields = this.config.form.items;
  }
  
  /**
   * Register a new user by subscribing to the user data services create method
   * @param user  Registration form field values sent to the user data service.
  */
  public onSubmit(user:any): void {
    user.siteName = this._ApiConfig.getPortal();
    this.user.create(user)
      .subscribe((res: Response) => {
        console.log(res);
      });
  }
}
