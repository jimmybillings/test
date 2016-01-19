import { Injectable } from 'angular2/core';

@Injectable()
export class CurrentUser {
  
  private currentUser: Object;
  
  constructor() {}
    
  public set(user:Object) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
  
  public get() {
    
  }
  
  public loggedIn() {
    return (localStorage.getItem('token') !== null)
  } 
     
}

