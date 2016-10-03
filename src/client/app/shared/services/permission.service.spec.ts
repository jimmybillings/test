import { inject, TestBed, beforeEachProvidersArray } from '../../imports/test.imports';
import { Observable } from 'rxjs/Rx';
import { UserPermission } from './permission.service';
import { CurrentUser } from './current-user.model';

export function main() {
  describe('Permission Service - user with permissions', () => {

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

    const mockCurrentUser = {
      profile: Observable.of(user)
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          UserPermission,
          { provide: CurrentUser, useValue: mockCurrentUser }
        ]
      });
    });

    describe('retrievePermissions()', () => {
      let service: UserPermission;

      beforeEach(inject([UserPermission], (userPermission: UserPermission) => {
        service = userPermission;
      }));

      it('sets the permissions variable', () => {
        service.retrievePermissions();
        expect(service.permissions).toEqual(['ViewClips', 'ViewCollections', 'ViewCarts']);
      });
    });

    describe('has()', () => {
      let service: UserPermission;

      beforeEach(inject([UserPermission], (userPermission: UserPermission) => {
        service = userPermission;
        service.retrievePermissions();
      }));

      it('returns true if a user has a certain permission', () => {
        expect(service.has('ViewCarts')).toBe(true);
        expect(service.has('ViewCollections')).toBe(true);
        expect(service.has('ViewClips')).toBe(true);
      });

      it('returns false if a user doesn\'t have a certain permission', () => {
        expect(service.has('Root')).toBe(false);
        expect(service.has('NotAPermission')).toBe(false);
      });
    });
  });

  describe('Permission Service - user with role', () => {

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

    const mockCurrentUser = {
      profile: Observable.of(user)
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ...beforeEachProvidersArray,
          UserPermission,
          { provide: CurrentUser, useValue: mockCurrentUser }
        ]
      });
    });

    describe('retrievePermissions()', () => {
      let service: UserPermission;

      beforeEach(inject([UserPermission], (userPermission: UserPermission) => {
        service = userPermission;
      }));

      it('sets the permissions variable', () => {
        service.retrievePermissions();
        expect(service.permissions).toEqual(['DeleteCollections', 'EditCollections', 'CreateCollections', 'ViewCollections', 'ViewClips']);
      });
    });

    describe('has()', () => {
      let service: UserPermission;

      beforeEach(inject([UserPermission], (userPermission: UserPermission) => {
        service = userPermission;
        service.retrievePermissions();
      }));

      it('returns true if a user has a certain permission', () => {
        expect(service.has('DeleteCollections')).toBe(true);
        expect(service.has('EditCollections')).toBe(true);
        expect(service.has('CreateCollections')).toBe(true);
        expect(service.has('ViewCollections')).toBe(true);
        expect(service.has('ViewClips')).toBe(true);
      });

      it('returns false if a user doesn\'t have a certain permission', () => {
        expect(service.has('Root')).toBe(false);
        expect(service.has('NotAPermission')).toBe(false);
      });
    });
  });
}
