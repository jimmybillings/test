import {
  beforeEachProvidersArray,
  ResponseOptions,
  RequestOptions,
  MockBackend,
  Response,
  TestBed,
  inject
} from '../../imports/test.imports';

import { FilterService } from './filter.service';

export function main() {
  describe('Filter Service', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        FilterService
      ]
    }));

    it('Should exist with instances of http, store, currentUser, and apiConfig',
      inject([FilterService], (service: FilterService) => {
        expect(service).toBeDefined();
        expect(service.store).toBeDefined();
        expect(service.api).toBeDefined();
        expect(service.apiConfig).toBeDefined();
        expect(service.currentUser).toBeDefined();
      }));

    it('Should have a setFilters method that updates the store',
      inject([FilterService], (service: FilterService) => {
        spyOn(service.store, 'dispatch');
        service.set(mockFilters());
        expect(service.store.dispatch).toHaveBeenCalledWith({type: 'FILTERS.SET_FILTERS', payload: mockFilters()});
      }));

    it('Should have a getFilterTreeUrl() method that returns the proper url based on the user',
      inject([FilterService], (service: FilterService) => {
        localStorage.setItem('token', '07yadbf1o78e2gfblalbfu4');
        expect(service.filterUrl).toBe('https://crxextapi.dev.wzplatform.com/api/assets/v1/filter/filterTree');
        localStorage.clear();
        expect(service.filterUrl).toBe('https://crxextapi.dev.wzplatform.com/api/assets/v1/filter/anonymous/filterTree');
      }));

    it('Should have a getFilterTreeOptions() method that builds search options based off of params and the current user',
      inject([FilterService], (service: FilterService) => {
        localStorage.setItem('token', 'aslkdbasldu298e39p8dakljn');
        let result = service.filterOptions({q: 'cat', counted: true});
        expect(result instanceof RequestOptions).toBeTruthy();
      }));

    it('Should have a getFilters() method that makes a get request to the filterTree api and caches the response in the store',
      inject([FilterService, MockBackend], (service: FilterService, mockBackend: MockBackend) => {
        localStorage.clear();
        let connection: any;
        spyOn(service, 'set');
        // spyOn(service, 'filterUrl').and.callThrough();
        spyOn(service, 'filterOptions').and.callThrough();
        connection = mockBackend.connections.subscribe((c: any) => connection = c);
        service.get({q: 'cat'}, true).subscribe((payload) => {
          expect(connection.request.method).toEqual(0);
          expect(connection.request.url).toBe('https://crxextapi.dev.wzplatform.com/api/assets/v1/filter/anonymous/filterTree?q=cat&counted=true&siteName=core');
          expect(payload).toEqual(service.sanatize(mockFilters(), null));
          expect(service.set).toHaveBeenCalled();
        });
        expect(service.filterOptions).toHaveBeenCalledWith({q: 'cat', counted: true});
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockFilters()
          })
        ));
      }));
  });

  function mockFilters() {
    return {
      'filterId': 1239,
      'name': 'corrupt',
      'subFilters': [
        {
          'filterId': 1240,
          'name': 'Format',
          'expanded': true,
          'subFilters': [
            {
              'filterId': 1241,
              'name': 'Any Format',
              'type': 'Link'
            },
            {
              'filterId': 1242,
              'name': 'Any Video',
              'type': 'Link'
            },
            {
              'filterId': 1243,
              'name': 'SD',
              'type': 'Link'
            },
            {
              'filterId': 1244,
              'name': 'SD Anamorphic',
              'type': 'Link'
            },
            {
              'filterId': 1245,
              'name': 'HD',
              'type': 'Link'
            },
            {
              'filterId': 1246,
              'name': 'Available on Film',
              'type': 'Link'
            },
            {
              'filterId': 1247,
              'name': 'Archive Footage',
              'type': 'Link'
            }
          ],
          'type': 'None'
        },
        {
          'filterId': 1248,
          'name': 'Specialty',
          'expanded': true,
          'subFilters': [
            {
              'filterId': 1249,
              'name': 'Any Specialty',
              'type': 'Link'
            },
            {
              'filterId': 1250,
              'name': 'Aerial',
              'type': 'Link'
            },
            {
              'filterId': 1251,
              'name': 'Slow Motion',
              'type': 'Link'
            },
            {
              'filterId': 1252,
              'name': 'Time Lapse',
              'type': 'Link'
            },
            {
              'filterId': 1253,
              'name': 'Black and White',
              'type': 'Link'
            },
            {
              'filterId': 1254,
              'name': 'Camera Angle',
              'expanded': false,
              'subFilters': [
                {
                  'filterId': 1255,
                  'name': 'Extreme Close Up',
                  'type': 'Link'
                },
                {
                  'filterId': 1256,
                  'name': 'Close Up',
                  'type': 'Link'
                },
                {
                  'filterId': 1257,
                  'name': 'Medium Close Up',
                  'type': 'Link'
                },
                {
                  'filterId': 1258,
                  'name': 'Medium',
                  'type': 'Link'
                },
                {
                  'filterId': 1259,
                  'name': 'Medium Long Shot',
                  'type': 'Link'
                },
                {
                  'filterId': 1260,
                  'name': 'Long Shot',
                  'type': 'Link'
                },
                {
                  'filterId': 1261,
                  'name': 'Extreme Long Shot',
                  'type': 'Link'
                },
                {
                  'filterId': 1262,
                  'name': 'Wide Shot',
                  'type': 'Link'
                },
                {
                  'filterId': 1263,
                  'name': 'High Angle',
                  'type': 'Link'
                },
                {
                  'filterId': 1264,
                  'name': 'Low Angle',
                  'type': 'Link'
                },
                {
                  'filterId': 1265,
                  'name': 'Side Angle',
                  'type': 'Link'
                },
                {
                  'filterId': 1266,
                  'name': 'POV',
                  'type': 'Link'
                },
                {
                  'filterId': 1267,
                  'name': 'Multiple',
                  'type': 'Link'
                }
              ],
              'type': 'List'
            }
          ],
          'type': 'None'
        },
        {
          'filterId': 1268,
          'name': 'Content',
          'expanded': true,
          'subFilters': [
            {
              'filterId': 1269,
              'name': 'Any Content',
              'type': 'Link'
            },
            {
              'filterId': 1270,
              'name': 'Branded Content',
              'type': 'Link'
            }
          ],
          'type': 'None'
        }
      ],
      'type': 'Text'
    };
  }
}
