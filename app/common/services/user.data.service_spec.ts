import {it,describe,expect,inject,injectAsync,beforeEachProviders} from 'angular2/testing';
import {provide, Injector} from 'angular2/core';
import {MockBackend} from 'angular2/http/testing';


import {User} from './user.data.service';
import { ApiConfig } from '../config/api.config';
import { CurrentUser } from '../models/current-user.model';

export function main() {
  describe('User Data Service', () => {
 
    beforeEachProviders(() => {
      return [
        HTTP_PROVIDERS,
        MockBackend,
        User,
        ApiConfig,
        CurrentUser
      ];
    });
    
    it('does something', () => {
      expect(true).toBe(true);
    });
    
    
  });

}
