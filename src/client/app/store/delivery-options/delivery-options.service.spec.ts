import { DeliveryOptionsService } from './delivery-options.service';
import { MockApiService, mockApiMatchers } from '../spec-helpers/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Delivery Options Service', () => {
    let serviceUnderTest: DeliveryOptionsService, mockApiService: MockApiService;

    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      serviceUnderTest = new DeliveryOptionsService(mockApiService.injector);
    });

    describe('getDeliveryOptions()', () => {
      it('calls the API correctly', () => {
        serviceUnderTest.getDeliveryOptions(47);
        expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Assets);
        expect(mockApiService.get).toHaveBeenCalledWithEndpoint('renditionType/deliveryOptions/47');
      });

      it('maps the data to a more suitable format for the UI', () => {
        mockApiService.getResponse = mockApiDeliveryOptions();

        let formattedDeliveryOptions: any;
        serviceUnderTest.getDeliveryOptions(111).take(1).subscribe(options => formattedDeliveryOptions = options);
        expect(formattedDeliveryOptions).toEqual(mockFormattedDeliveryOptions());
      });

      it('returns an observable of an empty array if no options are returned by the API', () => {
        mockApiService.getResponse = {};

        let formattedDeliveryOptions: any;
        serviceUnderTest.getDeliveryOptions(111).take(1).subscribe(options => formattedDeliveryOptions = options);
        expect(formattedDeliveryOptions).toEqual([]);
      });
    });
  });

  function mockApiDeliveryOptions(): { list: any[] } {
    return {
      list: [
        {
          deliveryOptionId: 5,
          deliveryOptionLabel: 'Watermarked Comp',
          renditionUrl: 'someUrl'
        },
        {
          deliveryOptionId: 7,
          deliveryOptionLabel: 'On Demand Comp'
        },
        {
          deliveryOptionId: 8,
          deliveryOptionLabel: 'Direct Download',
          deliveryOptionGroupId: 'directDown',
          deliveryOptionGroupOrder: '2',
          renditionUrl: 'someUrl'
        },
        {
          deliveryOptionId: 9,
          deliveryOptionLabel: 'Direct Download Aspera',
          deliveryOptionGroupId: 'directDown',
          deliveryOptionGroupOrder: '1',
          renditionUrl: 'someUrl'
        }
      ]
    };
  }

  function mockFormattedDeliveryOptions(): Array<any[]> {
    return [
      [
        {
          deliveryOptionId: 5,
          deliveryOptionLabel: 'Watermarked Comp',
          renditionUrl: 'someUrl'
        }
      ],
      [
        {
          deliveryOptionId: 7,
          deliveryOptionLabel: 'On Demand Comp'
        }
      ],
      [
        {
          deliveryOptionId: 9,
          deliveryOptionLabel: 'Direct Download Aspera',
          deliveryOptionGroupId: 'directDown',
          deliveryOptionGroupOrder: '1',
          renditionUrl: 'someUrl'
        },
        {
          deliveryOptionId: 8,
          deliveryOptionLabel: 'Direct Download',
          deliveryOptionGroupId: 'directDown',
          deliveryOptionGroupOrder: '2',
          renditionUrl: 'someUrl'
        }
      ]
    ];
  }
}


