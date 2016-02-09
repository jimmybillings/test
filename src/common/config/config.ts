import { Injectable } from 'angular2/core';

@Injectable()
export class Config {

  public ui(): Object {
    return {
      header: {
        logo: 'resources/img/logo_connect_rev_colr.svg'
      }
    };
  }
}
