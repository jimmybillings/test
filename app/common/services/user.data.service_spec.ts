import {
  describe,
  beforeEachProviders,
  expect,
  inject
} from 'angular2/testing';

import {MockBackend} from 'angular2/http/testing';
import {HTTP_PROVIDERS} from 'angular2/http';

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
