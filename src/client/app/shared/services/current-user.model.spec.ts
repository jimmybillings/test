import {
  inject,
  TestBed,
  beforeEachProvidersArray
} from '../../imports/test.imports';

import { Observable } from 'rxjs/Rx';

import { CurrentUser } from './current-user.model';
import { User } from '../interfaces/user.interface';

export function main() {
  describe('Current User model - user with permissions', () => {

    let user: any;

    user = {
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
        'ViewClips',
        'ViewCollections',
        'ViewCarts'
      ]
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CurrentUser
        ]
      });
    });

    describe('hasPermission()', () => {
      let service: CurrentUser;

      beforeEach(inject([CurrentUser], (currentUser: CurrentUser) => {
        service = currentUser;
        service.set(user);
      }));

      it('returns true if a user has a certain permission', () => {
        expect(service.hasPermission('ViewCarts')).toBe(true);
        expect(service.hasPermission('ViewCollections')).toBe(true);
        expect(service.hasPermission('ViewClips')).toBe(true);
      });

      it('returns false if a user doesn\'t have a certain permission', () => {
        expect(service.hasPermission('Root')).toBe(false);
        expect(service.hasPermission('NotAPermission')).toBe(false);
      });
    });
  });

  describe('Current User model - user with role', () => {

    let user: any;

    user = {
      'lastUpdated': '2016-01-14T16:46:21Z',
      'createdOn': '2016-01-14T16:46:21Z',
      'id': 6,
      'emailAddress': 'test_email@email.com',
      'password': '5daf7de08c0014ec2baa13a64b35a4e0',
      'firstName': 'first',
      'lastName': 'last',
      'siteName': 'cnn',
      'accountIds': [4],
      'roles': [
        {
          'lastUpdated': '2016-09-27T19:02:50Z',
          'createdOn': '2016-09-19T21:25:57Z',
          'id': 1,
          'siteName': 'core',
          'name': 'DefaultUser',
          'description': 'Default User Role for a Registered User',
          'permissions': [
            'DeleteCollections',
            'EditCollections',
            'CreateCollections',
            'ViewCollections',
            'ViewClips'
          ]
        }
      ]
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          CurrentUser
        ]
      });
    });

    describe('has()', () => {
      let service: CurrentUser;

      beforeEach(inject([CurrentUser], (currentUser: CurrentUser) => {
        service = currentUser;
        service.set(user);
      }));

      it('returns true if a user has a certain permission', () => {
        expect(service.hasPermission('DeleteCollections')).toBe(true);
        expect(service.hasPermission('EditCollections')).toBe(true);
        expect(service.hasPermission('CreateCollections')).toBe(true);
        expect(service.hasPermission('ViewCollections')).toBe(true);
        expect(service.hasPermission('ViewClips')).toBe(true);
      });

      it('returns false if a user doesn\'t have a certain permission', () => {
        expect(service.hasPermission('Root')).toBe(false);
        expect(service.hasPermission('NotAPermission')).toBe(false);
      });
    });
  });

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
      service.data.subscribe(user => {
        expect(user).toEqual(loggedInUser);
      });

      localStorage.clear();
    }));

    it('should set a object for a logged out user', inject([CurrentUser], (service: CurrentUser) => {
      localStorage.clear();
      service.set();
      service.data.subscribe(user => {
        expect(user).toEqual(loggedOutUser);
      });
      localStorage.clear();
    }));

    it('Should destroy the current user by resetting the user object and clearing localStorage',
      inject([CurrentUser], (service: CurrentUser) => {
        spyOn(localStorage, 'removeItem');
        spyOn(service, 'set');
        service.destroy();
        expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
        expect(service.set).toHaveBeenCalled();
      }));

    it('should return the correct email address of a user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.data.subscribe(profile => {
        expect(profile.emailAddress).toEqual('test_email@email.com');
      });
      localStorage.clear();
    }));

    it('should return the correct first name of a user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.data.subscribe(profile => {
        expect(profile.firstName).toEqual('first');
      });
      localStorage.clear();
    }));

    it('should return the correct last name of a user', inject([CurrentUser], (service: CurrentUser) => {
      service.set(loggedInUser);
      service.data.subscribe(profile => {
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
      service.data.subscribe(profile => {
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
      'purchaseOnCredit': false,
      'focusedCollection': null,
      'ownedCollections': null,
      'editableCollections': null,
      'accessibleCollections': null
    };
  }

  describe('Current User model - hasPurchaseOnCredit()', () => {
    let mockData: any;
    let mockStore: any;

    beforeEach(() => {
      mockData = {};
      mockStore = {
        select: (_: string) => Observable.of(mockData)
      };
    });

    it('returns true when the store defines purchaseOnCredit=true', () => {
      mockData = { purchaseOnCredit: true };

      expect(new CurrentUser(mockStore).hasPurchaseOnCredit()).toBe(true);
    });

    it('returns false when the store defines purchaseOnCredit=false', () => {
      mockData = { purchaseOnCredit: false };

      expect(new CurrentUser(mockStore).hasPurchaseOnCredit()).toBe(false);
    });

    it('returns false when the store does not define purchaseOnCredit', () => {
      mockData = {};

      expect(new CurrentUser(mockStore).hasPurchaseOnCredit()).toBe(false);
    });
  });

}
