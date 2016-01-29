import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
// import { provide } from 'angular2/angular2';
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
      expect(service.account())
        .toEqual([{
          'lastUpdated': '2016-01-07T23:27:09Z',
          'createdOn': '2016-01-07T23:27:09Z',
          'id': 3,
          'accountIdentifier': 'poc2',
          'name': 'Proof of Concept 2',
          'description': 'Proof of Concept 2',
          'isAdmin': false
        }]);
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
      'accounts': [
        {
          'lastUpdated': '2016-01-07T23:27:09Z',
          'createdOn': '2016-01-07T23:27:09Z',
          'id': 3,
          'accountIdentifier': 'poc2',
          'name': 'Proof of Concept 2',
          'description': 'Proof of Concept 2',
          'isAdmin': false
        }
      ]
    }; 
  }
  
  function setLoggedOutUser() {
    return {
      'emailAddress': null,
      'firstName': null,
      'lastName': null,
      'accounts': null
    };
  }
}
