import {
  inject,
  TestBed,
  beforeEachProvidersArray
} from '../../imports/test.imports';

import { CurrentUser } from './current-user.model';
import { User} from '../interfaces/user.interface';

export function main() {
  describe('CurrentUser Model', () => {
    let loggedInUser = setLoggedInUser();
    let loggedOutUser = setLoggedOutUser();
    // let loggedInUserWithoutPermissions = setLoggedInUserWithoutPermissions();

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        CurrentUser
      ]
    }));

    it('should set a object for a logged in user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.profile.subscribe(user => {
        expect(user).toEqual(loggedInUser);
      });

      localStorage.clear();
    }));

    it('should set a object for a logged out user', inject([CurrentUser], (service: CurrentUser) => {
      localStorage.clear();
      service.set();
      service.profile.subscribe(user => {
        expect(user).toEqual(loggedOutUser);
      });
      localStorage.clear();
    }));

    it('Should destroy the current user by resetting the user object and clearing localStorage', inject([CurrentUser], (service: CurrentUser) => {
      spyOn(localStorage, 'removeItem');
      spyOn(service, 'set');
      service.destroy();
      expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
      expect(service.set).toHaveBeenCalled();
    }));

    it('should return the correct email address of a user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.profile.subscribe(profile => {
        expect(profile.emailAddress).toEqual('test_email@email.com');
      });
      localStorage.clear();
    }));

    it('should return the correct first name of a user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.profile.subscribe(profile => {
        expect(profile.firstName).toEqual('first');
      });
      localStorage.clear();
    }));

    it('should return the correct last name of a user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.profile.subscribe(profile => {
        expect(profile.lastName).toEqual('last');
      });
      localStorage.clear();
    }));

    it('should return the correct full name of a user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.fullName().subscribe(name => {
        expect(name).toEqual('first last');
      });
      localStorage.clear();
    }));

    it('should return the correct accounts of a user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.profile.subscribe(profile => {
        expect(profile.accountIds).toEqual([4]);
      });
      localStorage.clear();
    }));

    it('should return the loggedIn state of a user as false', inject([CurrentUser], (service: CurrentUser) => {
      expect(service.loggedIn()).toBe(false);
    }));

    it('should return the loggedIn state of a user as true', inject([CurrentUser], (service: CurrentUser) => {
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
      'accountIds': [4],
      'permissions': [
        'Root'
      ]
    };
  }

  function setLoggedOutUser(): User {
    return {
      'lastUpdated': '',
      'createdOn': '',
      'id': 0,
      'emailAddress': '',
      'password': '',
      'firstName': '',
      'lastName': '',
      'siteName': '',
      'accountIds': [0],
      'permissions': [''],
      'focusedCollection': null,
      'ownedCollections': null,
      'editableCollections': null,
      'accessibleCollections': null
    };
  }
}
