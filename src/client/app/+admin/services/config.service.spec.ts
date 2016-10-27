import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { AdminSiteResponse, AdminUiResponse, SiteConfig, UiConfigInterface } from '../../shared/interfaces/admin.interface';
import { Api } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Rx';
import { ConfigService } from './config.service';

export function main() {
  describe('Config Service', () => {
    let serviceUnderTest: ConfigService;
    let mockApi: MockApiService;
    let mockConfig: UiConfigInterface;

    mockConfig = {id: 1, createdOn: '', lastUpdated: '', siteName: 'core', components: {config: {}}, config: {}}
    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApi = new MockApiService();
      serviceUnderTest = new ConfigService(mockApi.injector);
    });

    describe('getUiConfigIndex()', () => {
      it('hits the api properly', () => {
        serviceUnderTest.getUiConfigIndex();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('configuration/site/search');
      });
    });

    describe('getSiteConfigIndex()', () => {
      it('hits the api properly', () => {
        serviceUnderTest.getSiteConfigIndex();

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('site/search');
      });
    });

    describe('searchSiteConfig()', () => {
      it('hits the api properly', () => {
        serviceUnderTest.searchSiteConfig('core');

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('site/search');
        expect(mockApi.get).toHaveBeenCalledWithParameters({ q: 'core' });
      });
    });

    describe('showUiConfig()', () => {
      it('hits the api properly', () => {
        serviceUnderTest.showUiConfig('core');

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('configuration/site');
        expect(mockApi.get).toHaveBeenCalledWithParameters({ siteName: 'core' });
      });
    });

    describe('showSiteConfig()', () => {
      it('hits the api properly', () => {
        serviceUnderTest.showSiteConfig(1);

        expect(mockApi.get).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.get).toHaveBeenCalledWithEndpoint('site/1');
      });
    });

    describe('updateUiConfig()', () => {
      it('hits the api properly', () => {
        serviceUnderTest.updateUiConfig(mockConfig);

        expect(mockApi.put).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApi.put).toHaveBeenCalledWithEndpoint('configuration/site/1');
        expect(mockApi.put).toHaveBeenCalledWithBody(mockConfig);
      });
    });
  });
}
