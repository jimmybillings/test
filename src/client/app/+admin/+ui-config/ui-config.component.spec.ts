import {
  beforeEachProvidersArray,
  Observable,
  inject,
  addProviders
} from '../../imports/test.imports';

import { UiConfigComponent } from './ui-config.component';
import { ConfigService } from '../services/config.service';

export function main() {
  describe('Admin UI Config Component', () => {
    class MockConfigService {
      public showUiConfig(siteName: string) {
        return Observable.of(mockResponse());
      }
    }

    beforeEach(() => {
      addProviders([
        ...beforeEachProvidersArray,
        UiConfigComponent,
        { provide: ConfigService, useClass: MockConfigService },
      ]);
    });

    it('Should have a getConfig method that hits the service and stores data in variables',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.siteName = 'core';
        component.getConfig();
        expect(component.config).toEqual(mockResponse());
      }));

    it('Should have a goToSite method that given a siteName navigates to the ui-config page for that site',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        spyOn(component.router, 'navigate');
        component.goToSite('bbcws');
        expect(component.router.navigate).toHaveBeenCalledWith(['admin/ui-config/', 'bbcws']);
      }));

    it('Should have a show() method that sets subComponents',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.components = mockResponse().components;
        component.show('header');
        expect(component.subComponents).toEqual(mockResponse().components['header'].config);
      }));

    it('Should have a buildForm() method that sets form',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.subComponents = mockResponse().components['header'].config;
        component.buildForm('title');
        expect(component.form).toEqual({value: 'Wazee Digital'});
      }));

    it('Should have a showSubItems() method that sets configOptions',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.subComponents = mockResponse().components['adminAccount'].config;
        component.showSubItems('tableHeaders');
        expect(component.configOptions).toEqual(mockResponse().components['adminAccount'].config['tableHeaders'].items);
      }));

    it('Should have a buildSubItemForm() method that sets form',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.configOptions = mockResponse().components['adminAccount'].config['tableHeaders'].items;
        component.buildSubItemForm(1);
        expect(component.form).toEqual(mockResponse().components['adminAccount'].config['tableHeaders'].items[1]);
      }));

    it('Should have a removeItem() method that deletes a configOption',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        spyOn(component, 'update');
        component.config = mockResponse();
        component.configOptions = mockResponse().components['adminAccount'].config['tableHeaders'].items;
        component.removeItem(0);
        expect(component.configOptions).toEqual([
          {'name': 'status','label': 'ADMIN.ACCOUNT.STATUS_LABEL'},
          {'name': 'contact','label': 'ADMIN.ACCOUNT.CONTACT_LABEL'},
          {'name': 'createdOn','label': 'ADMIN.ACCOUNT.CREATED_ON_LABEL'}]);
        expect(component.update).toHaveBeenCalled();
      }));

    it('Should have a addItem() method that adds a configOption',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        component.config = mockResponse();
        component.configOptions = mockResponse().components['adminAccount'].config['tableHeaders'].items;
        component.addItem({type: 'text'});
        expect(component.form).toEqual({name: '', label: '', type: 'text', value: '', validation: ''});
        component.addItem({type: 'select'});
        expect(component.form).toEqual({name: '', label: '', type: 'select', value: '', validation: '', options: ''});
      }));

    it('Should have a reset() method that deletes a configOption',
      inject([UiConfigComponent], (component:UiConfigComponent) => {
        this.currentComponent = 'adminAccount';
        this.subComponents = mockResponse().components['adminAccount'].config;
        this.configOptions = mockResponse().components['adminAccount'].config['tableHeaders'].items;
        this.form = mockResponse().components['adminAccount'].config['tableHeaders'].items[0];
        component.reset();
        expect(component.currentComponent).toEqual(null);
        expect(component.subComponents).toEqual(null);
        expect(component.configOptions).toEqual(null);
        expect(component.form).toEqual(null);
      }));
  });

  function mockResponse() {
    let config: any = {
      'lastUpdated': '2016-06-06T16:44:59Z',
      'createdOn': '2016-03-02T17:01:14Z',
      'id': 1,
      'siteName': 'core',
      'config': {},
      'components': {
        'header': {'config': {'title': {'value': 'Wazee Digital'}}},
        'searchBox': {'config': {'pageSize': {'value': '100'}}},
        'search': {'config': {'viewType': {'value': 'grid'}}},
        'home': {'config': {'pageSize': {'value': '100'}}},
        'adminAccount': {'config': {
          'tableHeaders': {'items': [
            {'name': 'name','label': 'ADMIN.ACCOUNT.NAME_LABEL'},
            {'name': 'status','label': 'ADMIN.ACCOUNT.STATUS_LABEL'},
            {'name': 'contact','label': 'ADMIN.ACCOUNT.CONTACT_LABEL'},
            {'name': 'createdOn','label': 'ADMIN.ACCOUNT.CREATED_ON_LABEL'}]}
          }
        }
      }
    };
    return config;
  }
}
