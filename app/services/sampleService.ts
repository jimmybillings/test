import { Injectable } from 'angular2/core';

@Injectable()
export class MyService {
  message: string;

  constructor() {
    this.message = "Servics are working great";
  }

  public getMessage() {
    return this.message;
  }

}
