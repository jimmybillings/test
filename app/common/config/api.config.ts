import { Injectable } from 'angular2/core';
import { Headers } from 'angular2/http';

@Injectable()
export class ApiConfig {

  public getApiRoot() {
    return 'http://dev.crux.t3sandbox.xyz.:8080/';
  }

  public getAuthHeader() {
    return new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ JSON.parse(localStorage.getItem('token'))});
  }

  public getApiHeaders() {
    return new Headers({'Content-Type': 'application/json'});
  }
  
  public getPortal() {
    return 'cnn';
  }

}
