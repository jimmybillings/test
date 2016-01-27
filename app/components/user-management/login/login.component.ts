import { Component } from 'angular2/core';
import { FormBuilder, ControlGroup, FORM_DIRECTIVES, Validators } from 'angular2/common';
import { Response } from 'angular2/http';
import { Authentication } from '../../../common/services/authentication.data.service';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import { User } from '../../../common/services/user.data.service';
import { Router } from 'angular2/router';
import { CurrentUser } from '../../../common/models/current-user.model';

@Component({
  selector: 'login',
  templateUrl: 'components/user-management/login/login.html',
  providers: [Authentication],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})

export class Login {    
    
    public loginForm: ControlGroup;
   
  constructor(
    public _fb: FormBuilder,
    public _authentication: Authentication,
    public _user: User,
    public router: Router,
    private _ApiConfig: ApiConfig,
    private _currentUser: CurrentUser) { 
  }
  
  ngOnInit() {
    this.setForm();
  }
  
  public onSubmit(user: Object): void {
     this._authentication.create(user).subscribe((res:Response) => {
       localStorage.setItem('token', res.json().token);
       this._user.get().subscribe((res: Response) => {
          this._currentUser.set(res.json().user);
          this.router.navigate(['/Home']);
        });;
      });;
  }
  
  public setForm(): void {
     this.loginForm = this._fb.group({
        'userId': null,
        'password': ['',Validators.required],
        'accountIdentifier': this._ApiConfig.getPortal()
     });
  }
}


