import { SpeedPreviewService } from './speed-preview.service';
import { MockApiService, mockApiMatchers } from '../../shared/mocks/mock-api.service';
import { Api } from '../../shared/interfaces/api.interface';

export function main() {
  describe('Speed Preview Service', () => {
    let serviceUnderTest: SpeedPreviewService;
    let mockApiService: MockApiService;
    let mockCurrentUserService: any = {};
    let mockLoginInState: boolean;


    beforeEach(() => {
      jasmine.addMatchers(mockApiMatchers);
      mockApiService = new MockApiService();
      mockCurrentUserService.loggedIn = () => mockLoginInState;
      serviceUnderTest = new SpeedPreviewService(mockApiService.injector, mockCurrentUserService);
    });

    describe('load()', () => {
      it('calls the API correctly for a speed view for a logged in user.', () => {
        mockLoginInState = true;
        serviceUnderTest.load({ assetId: 1234 } as any).subscribe(() => {
          expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Assets);
          expect(mockApiService.get).toHaveBeenCalledWithEndpoint(`assetInfo/view/SpeedView/1234`);
          expect(mockApiService.get).not.toHaveBeenCalledWithOverridingToken(jasmine.any(String));
        });
      });

      it(`calls the API correctly for a speed view for an anonomous user.`, () => {
        mockLoginInState = false;
        serviceUnderTest.load({ assetId: 1234 } as any).subscribe(() => {
          expect(mockApiService.get).toHaveBeenCalledWithApi(Api.Assets);
          expect(mockApiService.get).toHaveBeenCalledWithEndpoint(`assetInfo/anonymous/view/SpeedView/1234`);
          expect(mockApiService.get).not.toHaveBeenCalledWithOverridingToken(jasmine.any(String));
        });
      });
    });
  });
}
