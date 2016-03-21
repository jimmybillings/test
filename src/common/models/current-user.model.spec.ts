import { it, describe, expect, inject, beforeEachProviders } from 'angular2/testing';
import { CurrentUser, currentUser } from './current-user.model';
import { provideStore } from '@ngrx/store/dist/index';

export function main() {

  describe('CurrentUser Model', () => {
    let loggedInUser = setLoggedInUser();
    let loggedOutUser = setLoggedOutUser();

    beforeEachProviders(() => [
      CurrentUser,
      provideStore({currentUser: currentUser}),
    ]);

    it('should set a object for a logged in user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      service._currentUser.subscribe(user => {
        expect(user).toEqual(loggedInUser);
      });
      
      localStorage.clear();
    }));

    it('should set a object for a logged out user', inject([CurrentUser], (service) => {
      service.set();
      service._currentUser.subscribe(user => {
        expect(user).toEqual(loggedOutUser);
      });
      localStorage.clear();
    }));

    it('should return the correct email address of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      service.email().subscribe(email => {
        expect(email).toEqual('test_email@email.com');
      });
      localStorage.clear();
    }));

    it('should return the correct first name of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      service.firstName().subscribe(first => {
        expect(first).toEqual('first');
      });
      localStorage.clear();
    }));

    it('should return the correct last name of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      service.lastName().subscribe(last => {
        expect(last).toEqual('last');
      });
      localStorage.clear();
    }));

    it('should return the correct full name of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      service.fullName().subscribe(firstLast => {
        expect(firstLast).toEqual('first last');
      });
      localStorage.clear();
    }));

    it('should return the correct accounts of a user', inject([CurrentUser], (service) => {
      service.set(loggedInUser);
      service.accountIds().subscribe(ids => {
        expect(ids).toEqual([4]);
      });
      localStorage.clear();
    }));

    it('should return the loggedIn state of a user as false', inject([CurrentUser], (service) => {
      expect(service.loggedIn()).toBe(false);
    }));

    it('should return the loggedIn state of a user as true', inject([CurrentUser], (service) => {
      localStorage.setItem('token', '99e6f262fd358051bf7584e11ec7a3');
      expect(service.loggedIn()).toBe(true);
      localStorage.clear();
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
