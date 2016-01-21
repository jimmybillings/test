import { Injectable } from 'angular2/core';
import { Headers } from 'angular2/http';


@Injectable()
export class ApiConfig {

  public getApiRoot() {
    return 'http://poc1.crux.t3sandbox.xyz./';
  }

  public getAuthHeader() {
    return new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem('token')});
  }

  public getApiHeaders() {
    return new Headers({'Content-Type': 'application/json'});
  }

}

