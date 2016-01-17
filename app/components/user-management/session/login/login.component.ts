import {Component} from 'angular2/core';
import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from 'angular2/common';
import {HTTP_PROVIDERS, Http, Response, Headers} from 'angular2/http';
import {Session} from '../session.service'
import { ApiConfig } from '../../../../services/api.config'

@Component({
  selector: 'login',
  templateUrl: '/app/components/user-management/session/login/login.html',
  styles:['p:{color:white;}'],
  providers: [Session, ApiConfig]
})

export class Login {    
    public _form: Object;
    public _fb: FormBuilder;
    public _session: Session;
  
  constructor(_fb: FormBuilder, _session: Session) {
     this._fb = _fb;
     this._session = _session;
     this._loginForm();
  }
  
  public onSubmit(user: Object) {
       this._session.create(user)
  }
  
  private _loginForm() {
     this._form = this._fb.group({
        userId: String,
        password: String,
        accountIdentifier: 'poc1',
     })  
  }
}
