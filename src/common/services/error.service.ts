import { Injectable } from 'angular2/core';
import { Router } from 'angular2/router';

@Injectable()
export class Error {
  
  constructor(public router: Router) {}
  
  
  public handle(error): void {
    switch(error.status) {
      case 401: 
        this.router.navigate(['UserManagement/Login']);
      default:
        
    }
  }
}
