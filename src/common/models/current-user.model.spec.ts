import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { CurrentUser } from './current-user.model';


export function main() {
  
  describe('CurrentUser Model', () => {
    let loggedInUser = setLoggedInUser();
    let loggedOutUser = setLoggedOutUser();
    
    beforeEachProviders(() => [CurrentUser]);
    
    it('should set a object for a logged in user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      expect(service._currentUser).toEqual(loggedInUser);
    }));
    
    it('should set a object for a logged out user', inject([CurrentUser], (service) => {
      localStorage.clear();
      service.set();
      expect(service._currentUser).toEqual(loggedOutUser);
    }));
    
    it('should return the correct email address of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      expect(service.email()).toEqual('test_email@email.com');
    }));
    
    it('should return the correct first name of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      expect(service.firstName()).toEqual('first');
    }));
    
    it('should return the correct last name of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      expect(service.lastName()).toEqual('last');
    }));
    
    it('should return the correct full name of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      expect(service.fullName()).toEqual('first last');
    }));
    
    it('should return the correct accounts of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      expect(service.accountIds()).toEqual([4]);
    }));
    
    it('should return the loggedIn state of a user as false', inject([CurrentUser], (service) => {
      expect(service.loggedIn()).toBe(false);
    }));
    
    it('should return the loggedIn state of a user as true', inject([CurrentUser], (service) => {
      localStorage.setItem('token', '99e6f262fd358051bf7584e11ec7a3');
      expect(service.loggedIn()).toBe(true);
    }));
  });
  
  function setLoggedInUser() {
    return {
      'lastUpdated': '2016-01-14T16:46:21Z',
      'createdOn': '2016-01-14T16:46:21Z',
      'id': 6,
      'emailAddress': 'test_email@email.com',
      'password': '5daf7de08c0014ec2baa13a64b35a4e0',
      'firstName': 'first',
      'lastName': 'last',
      'siteName': 'cnn',
      'accountIds': [4]
    }; 
  }
  
  function setLoggedOutUser() {
    return {
      'emailAddress': null,
      'firstName': null,
      'lastName': null,
      'id': null,
      'accountIds': null
    };
  }
}
