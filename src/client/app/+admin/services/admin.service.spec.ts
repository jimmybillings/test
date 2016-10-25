import { Observable } from 'rxjs/Rx';
import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { AdminService } from './admin.service';
import { AdminStore } from './admin.store';
import { AdminUrlParams, Account, AdminFormParams } from '../../shared/interfaces/admin.interface';
import { User } from '../../shared/interfaces/user.interface';

export function main() {
  describe('Admin Service', () => {
    let mockAdminStore: any;
    let serviceUnderTest: AdminService;
    let mockApi: MockApiService;
    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);

      mockAdminStore = {
        state: {},
        set: jasmine.createSpy('set')
      };

      mockApi = new MockApiService();

      serviceUnderTest = new AdminService(mockApi.injector, mockAdminStore);
    });

    describe('getResourceIndex()', () => {
      describe('should call get on the apiService correctly', () => {
        let params: AdminUrlParams;
        let paramsMinusOne: AdminUrlParams;

        beforeEach(() => {
          params = { i: '1', n: '20', s: 'createdOn', d: 'false', fields: 'someField', values: 'someValue' };
          paramsMinusOne = { i: '0', n: '20', s: 'createdOn', d: 'false', fields: 'someField', values: 'someValue' };
        });

        it('for a user with params', () => {
          serviceUnderTest.getResourceIndex(params, 'user');

          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('user/searchFields');
          expect(mockApi.get).toHaveBeenCalledWithParameters(paramsMinusOne);
        });

        it('for an account with params', () => {
          serviceUnderTest.getResourceIndex(params, 'account');

          expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.get).toHaveBeenCalledWithEndpoint('account/searchFields');
          expect(mockApi.get).toHaveBeenCalledWithParameters(paramsMinusOne);
        });

        it('should update the store with the response', () => {
          serviceUnderTest.getResourceIndex(params, 'user');

          expect(mockAdminStore.set).toHaveBeenCalledWith(mockApi.getResponse);
        });
      });
    });

    describe('postResource()', () => {
      let user: User;
      let account: Account;

      beforeEach(() => {
        user = {id: 1, siteName: 'core', password: 'password1', firstName: 'Ross', lastName: 'Edfort', emailAddress: 'email@emailAddress.com', createdOn: '', lastUpdated: ''};
        account = {id: 1, siteName: 'core', name: 'Edfort', accountIdentifier: 'RE', createdOn: '', lastUpdated: ''};
      });

      describe('should call the apiService correctly', () => {
        it('for a user', () => {
          serviceUnderTest.postResource('user', user);

          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('user');
          expect(mockApi.post).toHaveBeenCalledWithBody(user);
        });

        it('for an account', () => {
          serviceUnderTest.postResource('account', account);

          expect(mockApi.post).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.post).toHaveBeenCalledWithEndpoint('account');
          expect(mockApi.post).toHaveBeenCalledWithBody(account);
        });
      });
    });

    describe('putResource()', () => {
      let user: User;
      let account: Account;

      beforeEach(() => {
        user = {id: 1, siteName: 'core', password: 'password1', firstName: 'Ross', lastName: 'Edfort', emailAddress: 'email@emailAddress.com', createdOn: '', lastUpdated: ''};
        account = {id: 1, siteName: 'core', name: 'Edfort', accountIdentifier: 'RE', createdOn: '', lastUpdated: ''};
      });

      describe('should call the apiService correctly', () => {
        it('for a user', () => {
          serviceUnderTest.putResource('user', user);

          expect(mockApi.put).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.put).toHaveBeenCalledWithEndpoint('user/1');
          expect(mockApi.put).toHaveBeenCalledWithBody(user);
        });

        it('for an account', () => {
          serviceUnderTest.putResource('account', account);

          expect(mockApi.put).toHaveBeenCalledWithApi(Api.Identities);
          expect(mockApi.put).toHaveBeenCalledWithEndpoint('account/1');
          expect(mockApi.put).toHaveBeenCalledWithBody(account);
        });
      });
    });

    describe('buildSearchTerm()', () => {
      let filterParams: AdminFormParams;
      let formatedParams: any;
      let date: any;

      beforeEach(() => {
        date = (new Date('2016-10-01').getTime() / 1000).toString();
      });

      it('should format them correctly with date left out - before', () => {
        filterParams = {firstName: 'ross', lastName: '', emailAddress: '', DATE: 'before', createdOn: ''};
        formatedParams = serviceUnderTest.buildSearchTerm(filterParams);
        expect(formatedParams['fields']).toEqual('firstName,DATE:LT:createdOn');
        expect(formatedParams['values'].indexOf('ross,') > -1).toEqual(true);
      });

      it('should format them correctly with date left out - after', () => {
        filterParams = {firstName: 'ross', lastName: '', emailAddress: '', DATE: 'after', createdOn: ''};
        formatedParams= serviceUnderTest.buildSearchTerm(filterParams);
        expect(formatedParams['fields']).toEqual('firstName,DATE:GT:createdOn');
        expect(formatedParams['values'].indexOf('ross,') > -1).toEqual(true);
      });

      it('should format them correctly with a date - before', () => {
        filterParams = {firstName: 'Ross', lastName: 'Edfort', emailAddress: 'gmail', DATE: 'before', createdOn: '2016-10-01'};
        formatedParams = serviceUnderTest.buildSearchTerm(filterParams);
        expect(formatedParams['fields']).toEqual('firstName,lastName,emailAddress,DATE:LT:createdOn');
        expect(formatedParams['values']).toEqual(`Ross,Edfort,gmail,${date}`);
      });

      it('should format them correctly with a date - after', () => {
        filterParams = {firstName: 'Ross', lastName: 'Edfort', emailAddress: 'gmail', DATE: 'before', createdOn: '2016-10-01'};
        formatedParams = serviceUnderTest.buildSearchTerm(filterParams);
        expect(formatedParams['fields']).toEqual('firstName,lastName,emailAddress,DATE:LT:createdOn');
        expect(formatedParams['values']).toEqual(`Ross,Edfort,gmail,${date}`);
      });
    });
  });
}
