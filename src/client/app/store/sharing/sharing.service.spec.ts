import { SharingService } from './sharing.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Sharing Service', () => {
    let serviceUnderTest: SharingService, mockApiService: MockApiService;
    // let mockDate: Date;
    beforeEach(() => {
      // mockDate = new Date();
      // spyOn(window, 'Date').and.callFake(function () {
      //   return mockDate;
      // });
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new SharingService(mockApiService.injector, { state: { emailAddress: 'test@gmail.com' } } as any);
    });

    // ED - need some help testing here. Having issues with the dates.
    describe('createAssetShareLink()', () => {
      it('Should call the api correctly to create a share link', () => {
        serviceUnderTest.createAssetShareLink(1234, {
          'in': undefined,
          'out': undefined
        }).subscribe();
        expect(mockApiService.post).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApiService.post).toHaveBeenCalledWithEndpoint('accessInfo');
        // expect(mockApiService.post).toHaveBeenCalledWithBody({
        //   'type': 'asset',
        //   'accessInfo': '1234',
        //   'accessStartDate': '2017-11-21T09:07:20-07:00',
        //   'accessEndDate': '2017-12-01T09:07:20-07:00',
        //   'properties': null
        // });
      });
    });

    // ED - need some help testing here. Having issues with the dates.
    describe('emailAssetShareLink()', () => {
      it('Should call the api correctly to create a share link', () => {
        serviceUnderTest.emailAssetShareLink(1234, {
          'in': undefined,
          'out': undefined
        }, {
            'recipientEmails': 'james.billings@wazeedigital.com',
            'comment': 'Some Comment',
            'copyMe': true
          }).subscribe();
        expect(mockApiService.post).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApiService.post).toHaveBeenCalledWithEndpoint('accessInfo');
        // expect(mockApiService.post).toHaveBeenCalledWithBody({
        //   'type': 'asset',
        //   'accessInfo': '1234',
        //   'accessStartate': '2017-11-21T09:07:20-07:00',
        //   'accessEndDate': '2017-12-01T09:07:20-07:00',
        //   'properties': null
        // });
      });
    });

    describe('emailCollectionShareLink()', () => {
      it('Should call the api correctly to share a collection', () => {
        serviceUnderTest.emailCollectionShareLink(1, {
          'recipientEmails': 'james.billings@wazeedigital.com',
          'accessLevel': 'Viewer',
          'comment': 'Some Comment'
        }).subscribe();
        expect(mockApiService.post).toHaveBeenCalledWithApi(Api.Identities);
        expect(mockApiService.post).toHaveBeenCalledWithEndpoint('collection/share');
        expect(mockApiService.post).toHaveBeenCalledWithBody({
          userEmail: [
            'james.billings@wazeedigital.com'
          ],
          collections: [
            1
          ],
          accessLevel: 'Viewer',
          comment: 'Some Comment'
        });
      });
    });
  });
}
