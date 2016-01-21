import {Component} from 'angular2/core';
import {FormBuilder} from 'angular2/common';
import {Response} from 'angular2/http';
import {User} from '../../../common/services/user.data.service';

@Component({
  selector: 'register',
  templateUrl: 'components/user-management/register/register.html',
  providers: [User]
})

export class Register {
    public _user: User;
    public _form: Object;
    public _fb: FormBuilder;

  constructor(
      _fb: FormBuilder, 
      _user: User) {
     this._fb = _fb;
     this._user = _user;
     this._registerForm();
  }
  
  public onSubmit(user: Object) {
       this._user.create(user)
            .subscribe((res:Response) => {
                console.log(res);
            });
  }
  
  //   PRIVATE METHODS HERE
  private _registerForm() {
     this._form = this._fb.group({
        firstName: String,
        lastName: String,
        emailAddress: String,
        accountIdentifier: 'poc1',
        password: String
     }); 
  }
}





