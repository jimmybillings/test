import { Component, OnInit } from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { Response } from '@angular/http';
import { User } from '../services/user.data.service';

import { ROUTER_DIRECTIVES } from '@angular/router';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig } from '../../shared/services/ui.config';
import { IFormFields } from '../../shared/interfaces/forms.interface';
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
  ],
  pipes: [TranslatePipe]
})

export class RegisterComponent implements OnInit {
  public config: any;
  public components: Object;
  public fields: IFormFields[];

  constructor(
    public user: User,
    public _ApiConfig: ApiConfig,
    public uiConfig: UiConfig) {
  }

  ngOnInit(): void {
    this.uiConfig.get('register').subscribe(config => this.config = config.config);
  }

  /**
   * Register a new user by subscribing to the user data services create method
   * @param user  Registration form field values sent to the user data service.
  */
  public onSubmit(user: any): void {
    user.siteName = this._ApiConfig.getPortal();
    this.user.create(user)
      .subscribe((res: Response) => {
        console.log(res);
      });
  }
}
