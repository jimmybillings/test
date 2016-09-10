
import { Observable } from 'rxjs/Rx';
import { TestBed, inject, BaseRequestOptions, Http, ConnectionBackend, MockBackend } from '../../imports/testing.imports';
import { IndexComponent } from './index.component';
import { AdminService } from '../services/admin.service';
import { UiSubComponentsA } from '../../shared/interfaces/admin.interface';
import { User } from '../../shared/interfaces/user.interface';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { UiConfig, config } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { CurrentUser } from '../../shared/services/current-user.model';
import { provideStore } from '@ngrx/store';
import { ApiConfig } from '../../shared/services/api.config';
import { ActivatedRoute, Router} from '@angular/router';


export function main() {
  describe('Admin Index component', () => {
    class MockAdminService {
      getResourceIndex(resource: any, i: any) {
        return Observable.of(mockResponse());
      }

      putResource(resourceType: string, resource :any) {
        return Observable.of(mockUser());
      }

      postResource(resourceType: string, resource :any) {
        return Observable.of(mockUser());
      }

      setResources(data: any) {
        return true;
      }

      buildSearchTerm() {
        return { fields: 'firstName', values: 'john' };
      }

      updateRouteParams(args: any) {
        return Object.assign({}, args);
      }
    }
    class MockActivatedRoute {}
    class MockRouter {
      navigate(params: any) { return params; }
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          IndexComponent,
          { provide: AdminService, useClass: MockAdminService },
          UiConfig,
          UiState,
          CurrentUser,
          provideStore({config:config}),
          ApiConfig,
          {provide: Http,
            useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
              return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          MockBackend,
          BaseRequestOptions,
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: Router, useClass: MockRouter },

        ]
      });
    });

    it('Should create an instance variable of AdminService, and CurrentUser',
      inject([IndexComponent], (component: IndexComponent) => {
        expect(component.currentUser).toBeDefined();
        expect(component.adminService).toBeDefined();
      }));

    it('Should have a getIndex() function that calls the getResource and setResources functions on the service',
      inject([IndexComponent], (component: IndexComponent) => {
        component.resourceType = 'account';
        component.params = mockParams();
        spyOn(component.adminService, 'getResourceIndex').and.callThrough();
        spyOn(component.adminService, 'setResources').and.callThrough();
        component.getIndex();
        expect(component.adminService.getResourceIndex)
          .toHaveBeenCalledWith({ i: '1', n: '10', s: 'createdOn', d: 'false', values: '', fields: '' }, 'account');
      }));

    it('Should have a navigateToPageUrl function that navigates to a URL',
      inject([IndexComponent], (component: IndexComponent) => {
        component.resourceType = 'account';
        component.params = mockParams();
        spyOn(component.router, 'navigate');
        component.navigateToPageUrl('2');
        expect(component.router.navigate)
          .toHaveBeenCalledWith(['/admin/resource/account', Object({ i: '2', n: '10', s: 'createdOn', d: 'false', fields: '', values: '' })]);
      }));

    it('Should have a navigateToSortUrl function that navigates to a URL with correct params',
      inject([IndexComponent], (component: IndexComponent) => {
        component.resourceType = 'account';
        component.params = mockParams();
        spyOn(component.router, 'navigate');
        component.navigateToSortUrl({ s: 'emailAddress', d: 'true' });
        expect(component.router.navigate)
          .toHaveBeenCalledWith(['/admin/resource/account', Object({ i: 1, n: '10', s: 'emailAddress', d: 'true', fields: '', values: '' })]);
      }));

    it('Should have a navigateToFilterUrl function that navigates to a URL with correct params',
      inject([IndexComponent], (component: IndexComponent) => {
        component.resourceType = 'user';
        component.params = mockParams();
        spyOn(component.router, 'navigate');
        component.navigateToFilterUrl({ firstName: 'john' });
        expect(component.router.navigate)
          .toHaveBeenCalledWith(['/admin/resource/user', Object({ i: 1, n: '10', s: 'createdOn', d: 'false', fields: 'firstName', values: 'john' })]);
      }));

    it('Should have a mergeFormValues() function that merges config and form fields',
      inject([IndexComponent], (component: IndexComponent) => {
        component.config = mockConfig();
        component.mergeFormValues(mockUser());
        component.config['editForm'].items.forEach((field: FormFields)=> {
          expect(field.value).toBe(component.resource[field.name]);
        });
      }));

    it('Should have a onEditSubmit() function that calls the service to update an account or user',
      inject([IndexComponent], (component: IndexComponent) => {
        component.resource = mockUser();
        component.resourceType = 'user';
        spyOn(component.adminService, 'putResource').and.callThrough();
        spyOn(component, 'getIndex');
        let newUser : User = Object.assign(mockUser(), {'firstName': 'Bob'});
        component.onEditSubmit(newUser);
        expect(component.adminService.putResource).toHaveBeenCalledWith('user', newUser);
        expect(component.getIndex).toHaveBeenCalled();
      }));

    it('Should have a onNewSubmit() function that calls the service to create an account or user',
      inject([IndexComponent], (component: IndexComponent) => {
        component.resourceType = 'user';
        spyOn(component.adminService, 'postResource').and.callThrough();
        spyOn(component, 'getIndex');
        component.onNewSubmit(mockUser());
        expect(component.adminService.postResource).toHaveBeenCalledWith('user', mockUser());
        expect(component.getIndex).toHaveBeenCalled();
      }));

    it('Should have a buildRouteParams() function that builds an object of route params',
      inject([IndexComponent], (component: IndexComponent) => {
        component.buildRouteParams(mockParams());
        expect(component.params).toEqual({i: '1', n: '10', s: 'createdOn', d: 'false', fields: '', values: ''});
      }));
  });

  function mockUser() {
    let mockUser : User = {
      'lastUpdated': '2016-07-14T23:43:43Z',
      'createdOn': '2016-07-07T22:57:49Z',
      'id': 71,
      'siteName': 'commerce',
      'emailAddress': 'ross.edfort@wazeedigital.com',
      'userName': 'rossedfort',
      'password': '1d411073589938703696d15de48e38f4',
      'firstName': 'Ross',
      'lastName': 'Edfort',
      'permissions': [
        'DeleteCollections',
        'Root',
        'ShareCollections',
        'EditCollections',
        'CreateCollections',
        'ViewCollections',
        'ViewClips'
      ],
      'phoneNumber': '908-698-9024',
      'accountIds': [
        9
      ]
    };
    return mockUser;
  }

  function mockResponse() {
    return {
      'items': [{
        'lastUpdated': '2016-03-02T17:01:14Z', 'createdOn': '2016-03-02T17:01:14Z', 'id': 1, 'siteName': 'core', 'accountIdentifier': 'default',
        'name': 'Default', 'isAdmin': false, 'status': 'A', 'isDefault': true
      },
        {
          'lastUpdated': '2016-03-08T18:53:52Z', 'createdOn': '2016-03-08T18:53:52Z', 'id': 3, 'siteName': 'cnn', 'accountIdentifier': 'default', 'name': 'Default',
          'isAdmin': false, 'status': 'A', 'isDefault': true
        },
        {
          'lastUpdated': '2016-03-08T20:23:25Z', 'createdOn': '2016-03-08T20:23:25Z', 'id': 4, 'siteName': 'corbis', 'accountIdentifier': 'default', 'name': 'Default',
          'isAdmin': false, 'status': 'A', 'isDefault': true
        }],
      'totalCount': 6,
      'currentPage': 0,
      'pageSize': 20,
      'hasNextPage': false,
      'hasPreviousPage': false,
      'numberOfPages': 1
    };
  }

  function mockConfig() {
    let config: UiSubComponentsA = {
      'editForm': {
        'items': [
          {
            'name': 'firstName',
            'label': 'ADMIN.USER.FIRST_NAME_LABEL',
            'type': 'text',
            'value': '',
            'validation': 'REQUIRED'
          },
          {
            'name': 'lastName',
            'label': 'ADMIN.USER.LAST_NAME_LABEL',
            'type': 'text',
            'value': '',
            'validation': 'REQUIRED'
          },
          {
            'name': 'emailAddress',
            'label': 'ADMIN.USER.EMAIL_LABEL',
            'type': 'email',
            'value': '',
            'validation': 'OPTIONAL'
          },
          {
            'name': 'userName',
            'label': 'ADMIN.USER.USERNAME_LABEL',
            'type': 'text',
            'value': '',
            'validation': 'OPTIONAL'
          },
          {
            'name': 'phoneNumber',
            'label': 'ADMIN.USER.PHONE_NUMBER_LABEL',
            'type': 'text',
            'value': '',
            'validation': 'OPTIONAL'
          }
        ]
      },
      'newForm': {
        'items': [
          {
            'name': 'firstName',
            'label': 'ADMIN.USER.FIRST_NAME_LABEL',
            'type': 'text',
            'value': '',
            'validation': 'REQUIRED'
          },
          {
            'name': 'lastName',
            'label': 'ADMIN.USER.LAST_NAME_LABEL',
            'type': 'text',
            'value': '',
            'validation': 'REQUIRED'
          }
        ]
      }
    };
    return config;
  }

  function mockParams() {
    return { i: '1', n: '10', s: 'createdOn', d: 'false', fields: '', values: '' };
  }
}
