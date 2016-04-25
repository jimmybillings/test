import { Component } from 'angular2/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { Response } from 'angular2/http';
import { User } from '../services/user.data.service';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import { UiConfig } from '../../../common/config/ui.config';
import { IFormFields } from '../../../common/interfaces/forms.interface';
import { WzForm } from '../../../components/wz-form/wz.form.component';

/**
 * Registration page component - renders registration page and handles submiting registation form.
 */
@Component({
  selector: 'register',
  templateUrl: 'containers/user-management/register/register.html',
  providers: [User],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, WzForm],
  pipes: [TranslatePipe]
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
    this.uiConfig.get('register').subscribe( config => {
      this.config = config.config;
      this.fields = this.config.form.items;
    });
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
