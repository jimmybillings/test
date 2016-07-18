import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { ConfigComponent } from './config.component';
import { ConfigService } from '../services/config.service';
import { provide, PLATFORM_PIPES } from '@angular/core';
import { Router } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { UiConfig, config } from '../../shared/services/ui.config';
import { provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from 'ng2-translate/ng2-translate';

export function main() {
  describe('Admin Config component', () => {
    class MockRouter { }
    class MockConfigService {
      getUiConfigIndex() {
        return Observable.of(mockConfig());
      }

      getSiteConfigIndex() {
        return Observable.of(mockConfig());
      }
    }
    beforeEachProviders(() => [
      ConfigComponent,
      { provide: ConfigService, useClass: MockConfigService },
      { provide: Router, useClass: MockRouter },
      MockBackend,
      ApiConfig,
      UiConfig,
      BaseRequestOptions,
      provideStore({ config: config }),
      provide(Http, {
        useFactory: (backend: any, defaultOptions: any) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
      }),
      TranslateService,
      provide(PLATFORM_PIPES, {useValue: TranslatePipe, multi: true}),
    ]);

    it('Create instance of config',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(ConfigComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof ConfigComponent).toBeTruthy();
        });
      }));

    it('Should have instances of UiConfig, ConfigService, and Router defined',
      inject([ConfigComponent], (component: ConfigComponent) => {
        expect(component.uiConfig).toBeDefined();
        expect(component.configService).toBeDefined();
        expect(component.router).toBeDefined();
      }));

    it('Should have getConfigs() method that hits the service',
      inject([ConfigComponent], (component: ConfigComponent) => {
        spyOn(component.configService, 'getUiConfigIndex').and.callThrough();
        spyOn(component.configService, 'getSiteConfigIndex').and.callThrough();
        component.getConfigs();
        expect(component.configService.getUiConfigIndex).toHaveBeenCalled();
        expect(component.configService.getSiteConfigIndex).toHaveBeenCalled();
        expect(component.uiConfigs).toBeDefined();
        expect(component.siteConfigs).toBeDefined();
      }));
  });

  function mockConfig() {
    return { 'items': [{
      'lastUpdated': '2016-07-12T21:35:56Z',
      'createdOn': '2016-03-02T17:01:14Z',
      'id': 1,
      'siteName': 'core',
      'components': {
        'header': {
          'config': {
            'title': {
              'value': 'sd'
            }
          }
        },
        'searchBox': {
          'config': {
            'pageSize': {
              'value': '100'
            }
          }
        },
        'search': {
          'config': {
            'viewType': {
              'value': 'grid'
            }
          }
        },
        'home': {
          'config': {
            'pageSize': {
              'value': '100'
            }
          }
        },
        'notifications': {
          'items': [
            {
              'trString': 'NOTIFICATION.NEW_USER',
              'theme': 'success',
              'type': 'confirmed=true'
            },
            {
              'trString': 'NOTIFICATION.EXPIRED_SESSION',
              'theme': 'alert',
              'type': 'loggedOut=true'
            }
          ]
        },
        'register': {
          'config': {
            'form': {
              'items': [
                {
                  'name': 'firstName',
                  'label': 'REGISTER.FORM.FIRST_NAME_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'REQUIRED'
                },
                {
                  'name': 'lastName',
                  'label': 'REGISTER.FORM.LAST_NAME_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'REQUIRED'
                },
                {
                  'name': 'emailAddress',
                  'label': 'REGISTER.FORM.EMAIL_LABEL',
                  'type': 'email',
                  'value': '',
                  'validation': 'EMAIL'
                },
                {
                  'name': 'password',
                  'label': 'REGISTER.FORM.PASSWORD_LABEL',
                  'type': 'password',
                  'value': '',
                  'validation': 'PASSWORD'
                }
              ]
            }
          }
        },
        'login': {
          'config': {
            'form': {
              'items': [
                {
                  'name': 'userId',
                  'label': 'LOGIN.FORM.EMAIL_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'REQUIRED'
                },
                {
                  'name': 'password',
                  'label': 'LOGIN.FORM.PASSWORD_LABEL',
                  'type': 'password',
                  'value': '',
                  'validation': 'REQUIRED'
                }
              ]
            }
          }
        },
        'adminUser': {
          'config': {
            'tableHeaders': {
              'items': [
                {
                  'name': 'firstName',
                  'label': 'ADMIN.USER.FIRST_NAME_LABEL'
                },
                {
                  'name': 'lastName',
                  'label': 'ADMIN.USER.LAST_NAME_LABEL'
                },
                {
                  'name': 'emailAddress',
                  'label': 'ADMIN.USER.EMAIL_LABEL'
                },
                {
                  'name': 'createdOn',
                  'label': 'ADMIN.USER.CREATED_ON_LABEL'
                },
                {
                  'name': 'siteName',
                  'label': 'Site Name'
                },
                {
                  'name': 'phoneNumber',
                  'label': 'Phone Number',
                  'type': 'text',
                  'value': '',
                  'validation': ''
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
                },
                {
                  'name': 'emailAddress',
                  'label': 'ADMIN.USER.EMAIL_LABEL',
                  'type': 'email',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'password',
                  'label': 'ADMIN.USER.PASSWORD_LABEL',
                  'type': 'password',
                  'value': '',
                  'validation': 'PASSWORD'
                }
              ]
            },
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
            'searchForm': {
              'items': [
                {
                  'name': 'firstName',
                  'label': 'ADMIN.USER.FIRST_NAME_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'lastName',
                  'label': 'ADMIN.USER.LAST_NAME_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'emailAddress',
                  'label': 'ADMIN.USER.EMAIL_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'DATE',
                  'options': 'before,after',
                  'label': '',
                  'type': 'radio',
                  'value': 'before',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'createdOn',
                  'label': '',
                  'type': 'date',
                  'value': '',
                  'validation': 'OPTIONAL'
                }
              ]
            }
          }
        },
        'adminAccount': {
          'config': {
            'tableHeaders': {
              'items': [
                {
                  'name': 'name',
                  'label': 'ADMIN.ACCOUNT.NAME_LABEL'
                },
                {
                  'name': 'status',
                  'label': 'ADMIN.ACCOUNT.STATUS_LABEL'
                },
                {
                  'name': 'contact',
                  'label': 'ADMIN.ACCOUNT.CONTACT_LABEL'
                },
                {
                  'name': 'createdOn',
                  'label': 'ADMIN.ACCOUNT.CREATED_ON_LABEL'
                },
                {
                  'name': 'email',
                  'label': 'Email Address'
                }
              ]
            },
            'newForm': {
              'items': [
                {
                  'name': 'accountIdentifier',
                  'label': 'ADMIN.ACCOUNT.ACCOUNT_IDENTIFIER_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'REQUIRED'
                },
                {
                  'name': 'name',
                  'label': 'ADMIN.ACCOUNT.NAME_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'REQUIRED'
                },
                {
                  'name': 'description',
                  'label': 'ADMIN.ACCOUNT.DESCRIPTION_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'contact',
                  'label': 'ADMIN.ACCOUNT.CONTACT_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'email',
                  'label': 'ADMIN.ACCOUNT.EMAIL_LABEL',
                  'type': 'email',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'logoUrl',
                  'label': 'ADMIN.ACCOUNT.LOGO_URL_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                }
              ]
            },
            'editForm': {
              'items': [
                {
                  'name': 'name',
                  'label': 'ADMIN.ACCOUNT.NAME_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'status',
                  'label': 'ADMIN.ACCOUNT.STATUS_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'contact',
                  'label': 'ADMIN.ACCOUNT.CONTACT_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'alternateName',
                  'label': 'Alternate Name',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'email',
                  'label': 'Email Address',
                  'type': 'email',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'accountIdentifier',
                  'label': 'Account Identifier',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                }
              ]
            },
            'searchForm': {
              'items': [
                {
                  'name': 'name',
                  'label': 'ADMIN.ACCOUNT.NAME_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'status',
                  'label': 'ADMIN.ACCOUNT.STATUS_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'contact',
                  'label': 'ADMIN.ACCOUNT.CONTACT_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'DATE',
                  'options': 'before,after',
                  'label': '',
                  'type': 'radio',
                  'value': 'before',
                  'validation': 'OPTIONAL'
                },
                {
                  'name': 'createdOn',
                  'label': '',
                  'type': 'date',
                  'value': '',
                  'validation': 'OPTIONAL'
                }
              ]
            }
          }
        },
        'collection': {
          'config': {
            'form': {
              'items': [
                {
                  'name': 'name',
                  'label': 'COLLECTION.FORM.COLLECTION_NAME_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'REQUIRED'
                },
                {
                  'name': 'tags',
                  'label': 'COLLECTION.FORM.TAGS_LABEL',
                  'type': 'text',
                  'value': '',
                  'validation': 'OPTIONAL'
                }
              ]
            }
          }
        },
        'configuration': {
          'config': {
            'tableHeaders': {
              'items': [
                {
                  'name': 'siteName',
                  'label': 'ADMIN.CONFIG.SITE_LABEL'
                },
                {
                  'name': 'lastUpdated',
                  'label': 'ADMIN.CONFIG.LAST_UPDATED_LABEL'
                },
                {
                  'name': 'lastUpdateBy',
                  'label': 'ADMIN.CONFIG.LAST_UPDATE_BY_LABEL'
                }
              ]
            }
          }
        }
      }
    }]};
  }
}
