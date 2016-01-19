import { Injectable } from 'angular2/core';

@Injectable()
export class CurrentUser {
  
  constructor() {}
  
  public setUser() {
    
  }
  
  public loggedIn() {
    return (localStorage.getItem('token') !== null)
  } 
     
}

