import {
  beforeEachProvidersArray,
  ResponseOptions,
  MockBackend,
  Response,
  inject,
  TestBed
} from '../../imports/test.imports';

import { AssetService } from './asset.service';

export function main() {
  describe('Asset service', () => {

    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        AssetService
      ]
    }));

    it('Should setup instance variables for the api endpoint and the asset store',
      inject([AssetService], (service: AssetService) => {
        // expect(service._apiUrl).toEqual('https://crxextapi.dev.wzplatform.com/api/assets/v1/clip/');
        service.data.subscribe((asset) => {
          expect(asset).toEqual({ clipData: [], common: [], primary: [], secondary: [], filter: '', name: '', price: 0 });
        });
      }));

    it('Should call the api endpoint for Asset and return a correctly formatted payload to cache in the Asset Store',
      inject([AssetService, MockBackend], (service: AssetService, mockBackend: MockBackend) => {
        let connection: any;
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.initialize(26307591).subscribe(payload => {
          expect(connection.request.url.indexOf('/api/assets/v1/clip/26307591/clipDetail') !== -1).toBe(true);

          // expect(payload).toEqual( { type: 'SET_ASSET', payload: MockAssetResponse()});
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: MockAssetResponse()
          })
        ));
      }));

    it('Should expect a correctly formatted payload it add it to the Asset Store', inject([AssetService], (service: AssetService) => {
      spyOn(service.store, 'dispatch');
      service.set({ type: 'SET_ASSET', payload: MockAssetResponse() });
      expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'SET_ASSET', payload: MockAssetResponse() });
    }));

    it('Should expect a correctly formatted payload it add it to the Asset Store', inject([AssetService], (service: AssetService) => {
      spyOn(service.store, 'dispatch');
      service.reset();
      expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'RESET' });
    }));
  });

  function MockAssetResponse() {
    return {
      'items': [
        {
          'assetId': 28068744, 'name': '80805947_032',
          'metaData': [
            { 'name': 'Title', 'value': '' },
            { 'name': 'Description', 'value': 'Rubber dog toys fill a bin at Kirkhill Rubber Manufacturing.' },
            { 'name': 'TE.DigitalFormat', 'value': 'High Definition' },
            { 'name': 'Format.Duration', 'value': '9600' }
          ],
          'thumbnail': {
            'name': '80805947_032_lt.jpg',
            'urls': {
              'http-download': 'http://s3-t3m-previewpub-or-1.s3.amazonaws.com/808/059/47/80805947_032_lt.jpg'
            }
          }
        }
      ]
    };
  }
}
