import {
  beforeEachProvidersArray,
  MockBackend,
  inject,
  Response,
  ResponseOptions,
  TestBed
} from '../../imports/test.imports';
import { UserPreferenceService } from './user-preference.service';

export function main() {
  describe('UserPreferenceService', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [
        ...beforeEachProvidersArray,
        UserPreferenceService
      ]
    }));
    let connection: any;

    it('Should have an instance of currentUser, store, api and apiConfig',
      inject([UserPreferenceService], (service: UserPreferenceService) => {
        expect(service.currentUser).toBeDefined();
        expect(service.store).toBeDefined();
        expect(service.api).toBeDefined();
        expect(service.apiConfig).toBeDefined();
      }));

    it('Should have a getSortOptions method to get sortDefinitions',
      inject([UserPreferenceService, MockBackend], (service: UserPreferenceService, mockBackend: MockBackend) => {
        mockBackend.connections.subscribe((c: any) => connection = c);
        service.getSortOptions().subscribe((res) => {
          expect(connection.request.url).toBe(service.apiConfig.baseUrl() + 'api/identities/v1/sortDefinition/list');
          expect(res).toEqual(mockResponse());
        });
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: mockResponse()
          })
        ));
      }));

      it('Should have an update() method that updates the store',
        inject([UserPreferenceService], (service: UserPreferenceService) => {
          spyOn(service.store, 'dispatch');
          service.update({filterCounts: true});
          expect(service.store.dispatch).toHaveBeenCalledWith({ type: 'UPDATE_PREFERENCES', payload: {filterCounts: true} });
        }));

      it('Should have a state() getter method that returns the state of the store',
        inject([UserPreferenceService], (service: UserPreferenceService) => {
          expect(service.state).toEqual({filterCounts: false, sorts: [], currentSort: {}});
        }));

  });

  function mockResponse() {
    return {
      'list': [
        {
          'first': {
            'lastUpdated': '2016-09-21T15:06:40Z',
            'createdOn': '2016-08-18T18:01:44Z',
            'id': 2,
            'siteName': 'core',
            'name': 'Relevance (most relevant first)',
            'isDefault': false,
            'pairId': 'testPair',
            'association': 'user:1',
            'sorts': [
              {
                'field': 'score',
                'descending': true
              }
            ]
          }
        }
      ]
    };
  }
}
